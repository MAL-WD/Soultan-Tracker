const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const webpush = require('web-push');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? (process.env.FRONTEND_URL || '*') : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'soltan-secret-key-2026';
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('⚠️ WARNING: JWT_SECRET environment variable is not set in production. Falling back to default secret, which is a major security risk!');
}
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/soltan-tracker';

// ============================================
// MONGOOSE SCHEMAS & MODELS
// ============================================

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'], 
    unique: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { 
    type: String, 
    enum: ['admin', 'manager'], 
    default: 'manager' 
  },
  branchId: { 
    type: String, 
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date, 
    default: null 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

const DataSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: [true, 'Key is required'], 
    unique: true
  },
  value: { 
    type: String, 
    required: [true, 'Value is required']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});


const ActivitySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  action: { 
    type: String, 
    enum: ['create', 'update', 'delete', 'login', 'logout'],
    required: true
  },
  dataKey: { 
    type: String,
    default: null
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  details: { 
    type: String,
    default: null
  }
});

const PushSubscriptionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  subscription: {
    type: Object,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});
PushSubscriptionSchema.index({ 'subscription.endpoint': 1 }, { unique: true });
const PushSubscription = mongoose.model('PushSubscription', PushSubscriptionSchema);

const User = mongoose.model('User', UserSchema);
const Data = mongoose.model('Data', DataSchema);
const Activity = mongoose.model('Activity', ActivitySchema);

const GlobalConstantSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: [true, 'Key is required'], 
    unique: true 
  },
  value: { 
    type: mongoose.Schema.Types.Mixed, 
    required: [true, 'Value is required'] 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});
const GlobalConstant = mongoose.model('GlobalConstant', GlobalConstantSchema);

// ============================================
// MIDDLEWARE
// ============================================

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'No token provided. Authorization denied.' 
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token.' 
    });
  }
};

// Input Validation Middleware
const validateInputs = (req, res, next) => {
  req.errors = [];
  next();
};

// Error Handler
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: Object.values(err.errors).map(e => e.message).join(', ')
    });
  }
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry. This data already exists.'
    });
  }
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
};

// ============================================
// AUTHENTICATION ROUTES
// ============================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per window
  message: { success: false, error: 'Too many login attempts, please try again after 15 minutes' }
});

app.post('/api/auth/register', validateInputs, async (req, res, next) => {
  try {
    const { username, password, role, branchId } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required.'
      });
    }

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists. Please choose another.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
      role: role || 'manager',
      branchId: branchId || null
    });

    await user.save();

    // Log activity
    await Activity.create({
      userId: user._id,
      action: 'create',
      details: `User registered: ${username}`
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, branchId: user.branchId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        branchId: user.branchId
      }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/login', [validateInputs, loginLimiter], async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required.'
      });
    }

    const user = await User.findOne({ username });
    if (!user || !user.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Invalid username or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid username or password.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log activity
    await Activity.create({
      userId: user._id,
      action: 'login',
      details: `Login successful`
    });

    const token = jwt.sign(
      { id: user._id, role: user.role, branchId: user.branchId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        branchId: user.branchId
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get Current User Profile
app.get('/api/auth/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
});

// ============================================
// ADMIN USER MANAGEMENT ROUTES (Protected, Admin-only)
// ============================================

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Administrator privileges required.'
    });
  }
  next();
};

// GET all users
app.get('/api/users', [auth, adminOnly], async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    next(err);
  }
});

// UPDATE user details
app.put('/api/users/:id', [auth, adminOnly], async (req, res, next) => {
  try {
    const { username, role, branchId, isActive, password } = req.body;
    const updateData = { username, role, branchId, isActive };

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password.trim(), salt);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    await Activity.create({
      userId: req.user.id,
      action: 'update',
      details: `Admin updated user details for: ${username}`
    });

    res.json({
      success: true,
      message: 'User updated successfully.',
      data: user
    });
  } catch (err) {
    next(err);
  }
});

// DELETE a user
app.delete('/api/users/:id', [auth, adminOnly], async (req, res, next) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own administrator account.'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    await Activity.create({
      userId: req.user.id,
      action: 'delete',
      details: `Admin deleted user account: ${user.username}`
    });

    res.json({
      success: true,
      message: 'User deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// ============================================
// GLOBAL CONSTANTS ROUTES
// ============================================

// GET all global constants (Protected, accessible to all authenticated users)
app.get('/api/global-constants', auth, async (req, res, next) => {
  try {
    const constants = await GlobalConstant.find();
    const formatted = {};
    constants.forEach(c => {
      formatted[c.key] = c.value;
    });
    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

// CREATE or UPDATE a global constant (Protected, Admin-only)
app.post('/api/global-constants', [auth, adminOnly], async (req, res, next) => {
  try {
    const { key, value } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Key and value are required.'
      });
    }

    const item = await GlobalConstant.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    // Log admin activity
    await Activity.create({
      userId: req.user.id,
      action: 'update',
      details: `Admin updated global constant: ${key}`
    });

    res.json({
      success: true,
      message: 'Global constant updated successfully.',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// ============================================
// STORAGE ROUTES (Protected)
// ============================================

// GET single data item
app.get('/api/storage/:key', auth, async (req, res, next) => {
  try {
    const item = await Data.findOne({ key: req.params.key });
    res.json({
      success: true,
      data: item ? { value: item.value, createdAt: item.createdAt, updatedAt: item.updatedAt } : null
    });
  } catch (err) {
    next(err);
  }
});

// GET all data for user
app.get('/api/storage', auth, async (req, res, next) => {
  try {
    const items = await Data.find().sort({ updatedAt: -1 });
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    next(err);
  }
});

// CREATE or UPDATE data (Upsert)
app.post('/api/storage', auth, async (req, res, next) => {
  try {
    const { key, value } = req.body;

    if (!key || !value) {
      return res.status(400).json({
        success: false,
        error: 'Key and value are required.'
      });
    }

    const item = await Data.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true, runValidators: true }
    );

    // Log activity
    const isNew = item.createdAt === item.updatedAt;
    await Activity.create({
      userId: req.user.id,
      action: isNew ? 'create' : 'update',
      dataKey: key,
      details: `Data ${isNew ? 'created' : 'updated'} with key: ${key}`
    });

    res.json({
      success: true,
      message: 'Data saved successfully.',
      data: item
    });
  } catch (err) {
    next(err);
  }
});

// DELETE data
app.delete('/api/storage/:key', auth, async (req, res, next) => {
  try {
    const item = await Data.findOneAndDelete({ key: req.params.key });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Data not found.'
      });
    }

    // Log activity
    await Activity.create({
      userId: req.user.id,
      action: 'delete',
      dataKey: req.params.key,
      details: `Data deleted with key: ${req.params.key}`
    });

    res.json({
      success: true,
      message: 'Data deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
});

// ============================================
// ACTIVITY LOG ROUTES
// ============================================

// GET user activities
app.get('/api/activities', auth, async (req, res, next) => {
  try {
    const limit = req.query.limit || 50;
    const activities = await Activity
      .find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (err) {
    next(err);
  }
});

// ============================================
// HEALTH CHECK
// ============================================

// ============================================
// PUSH NOTIFICATIONS ROUTES
// ============================================

app.get('/api/push/vapid-public-key', (req, res) => {
  if (!app.locals.vapidPublicKey) {
    return res.status(500).json({ success: false, error: 'VAPID keys not initialized' });
  }
  res.json({ success: true, publicKey: app.locals.vapidPublicKey });
});

app.post('/api/push/subscribe', auth, async (req, res, next) => {
  try {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ success: false, error: 'Invalid subscription' });
    }
    
    await PushSubscription.findOneAndUpdate(
      { 'subscription.endpoint': subscription.endpoint },
      { userId: req.user.id, subscription },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, message: 'Subscribed to push notifications' });
  } catch (err) {
    next(err);
  }
});

app.post('/api/push/test', auth, async (req, res, next) => {
  try {
    const subs = await PushSubscription.find({ userId: req.user.id });
    if (subs.length === 0) return res.status(404).json({ success: false, error: 'No subscriptions found' });
    
    const payload = JSON.stringify({
      title: 'إشعار تجريبي',
      body: 'تم تفعيل الإشعارات بنجاح على هذا الجهاز!',
      icon: '/icon-192x192.png'
    });

    for (const sub of subs) {
      try {
        await webpush.sendNotification(sub.subscription, payload);
      } catch (e) {
        if (e.statusCode === 410 || e.statusCode === 404) {
          await PushSubscription.findByIdAndDelete(sub._id);
        }
      }
    }
    res.json({ success: true, message: 'Test notification sent' });
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ============================================
// DATABASE CONNECTION
// ============================================

mongoose.connect(MONGODB_URI, {
  retryWrites: true
})
  .then(async () => {
    console.log('✅ MongoDB Connected:', MONGODB_URI);
    
    await initWebPush();
    // Initialize admin user if needed
    initializeDatabase();
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Database initialization
const initializeDatabase = async () => {
  try {
    // 1. Seed Admin User
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD;
      
      if (!password && process.env.NODE_ENV === 'production') {
        console.log('⚠️ Warning: No admin user exists in production, and ADMIN_PASSWORD environment variable is not defined. Skipping auto-seeding for security.');
      } else {
        const seedPassword = password || 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(seedPassword, salt);
        
        await User.create({
          username,
          password: hashedPassword,
          role: 'admin',
          branchId: '400'
        });
        
        console.log(`✅ Admin user seeded: username=${username}, password=${password ? '********' : 'admin123 (Default)'}`);
      }
    }

    // 2. Seed Default Global Constants
    const dayContentTypesExists = await GlobalConstant.findOne({ key: 'DAY_CONTENT_TYPES' });
    if (!dayContentTypesExists) {
      await GlobalConstant.create({
        key: 'DAY_CONTENT_TYPES',
        value: {
          SAT: ["carousel"],
          SUN: ["video"],
          MON: ["photo", "carousel"],
          TUE: ["video"],
          WED: ["carousel"],
          THU: ["video"],
          FRI: ["video", "video"],
        }
      });
      console.log('✅ Global constant DAY_CONTENT_TYPES seeded.');
    }

    const smTasksByTypeExists = await GlobalConstant.findOne({ key: 'SM_TASKS_BY_TYPE' });
    if (!smTasksByTypeExists) {
      await GlobalConstant.create({
        key: 'SM_TASKS_BY_TYPE',
        value: {
          carousel: [
            { id: "research", label: "بحث الموضوع",  icon: "🔍", cat: "تحضير"  },
            { id: "script",   label: "السكريبت",      icon: "✍️", cat: "تحضير"  },
            { id: "design",   label: "التصميم",        icon: "🎨", cat: "إنتاج"  },
            { id: "caption",  label: "الكابشن",        icon: "📝", cat: "إنتاج"  },
            { id: "hashtags", label: "الهاشتاقات",    icon: "#️⃣", cat: "إنتاج"  },
            { id: "review",   label: "المراجعة",       icon: "✅", cat: "مراجعة" },
            { id: "publish",  label: "النشر",          icon: "📤", cat: "نشر"    },
            { id: "engage",   label: "التفاعل",        icon: "💬", cat: "تفاعل"  },
          ],
          video: [
            { id: "concept", label: "الفكرة",    icon: "💡", cat: "تحضير"  },
            { id: "script",  label: "السكريبت", icon: "✍️", cat: "تحضير"  },
            { id: "filming", label: "التصوير",   icon: "🎬", cat: "إنتاج"  },
            { id: "edit",    label: "المونتاج",  icon: "✂️", cat: "إنتاج"  },
            { id: "caption", label: "الكابشن",  icon: "📝", cat: "إنتاج"  },
            { id: "review",  label: "المراجعة", icon: "✅", cat: "مراجعة" },
            { id: "publish", label: "النشر",     icon: "📤", cat: "نشر"    },
            { id: "engage",  label: "التفاعل",  icon: "💬", cat: "تفاعل"  },
          ],
          photo: [
            { id: "concept",  label: "الاختيار",   icon: "🎯", cat: "تحضير"  },
            { id: "design",   label: "التصميم",    icon: "🎨", cat: "إنتاج"  },
            { id: "caption",  label: "الكابشن",    icon: "📝", cat: "إنتاج"  },
            { id: "hashtags", label: "الهاشتاقات", icon: "#️⃣", cat: "إنتاج"  },
            { id: "review",   label: "المراجعة",   icon: "✅", cat: "مراجعة" },
            { id: "publish",  label: "النشر",      icon: "📤", cat: "نشر"    },
          ],
        }
      });
      console.log('✅ Global constant SM_TASKS_BY_TYPE seeded.');
    }

    // 3. Migrate Data to be global
    try {
      await Data.collection.dropIndex('key_1_userId_1');
      console.log('✅ Dropped old compound index key_1_userId_1');
    } catch (e) {
      // Ignore if index does not exist
    }

    try {
      // Find all data to group by key
      const allData = await Data.find();
      const grouped = {};
      for (const d of allData) {
        if (!grouped[d.key]) grouped[d.key] = [];
        grouped[d.key].push(d);
      }

      for (const key in grouped) {
        const docs = grouped[key];
        if (docs.length > 1) {
          // Merge duplicates
          docs.sort((a, b) => a.updatedAt - b.updatedAt); // Older first
          let mergedVal = null;
          
          for (const d of docs) {
            try {
              const parsed = JSON.parse(d.value);
              if (Array.isArray(parsed)) {
                mergedVal = parsed; // For arrays, just take the newest
              } else if (parsed && typeof parsed === 'object') {
                if (!mergedVal) mergedVal = {};
                // Deep merge
                const mergeDeep = (target, source) => {
                  Object.keys(source).forEach(k => {
                    const tv = target[k];
                    const sv = source[k];
                    if (Array.isArray(tv) && Array.isArray(sv)) {
                      target[k] = sv;
                    } else if (tv && sv && typeof tv === 'object' && typeof sv === 'object' && !Array.isArray(tv)) {
                      target[k] = mergeDeep(Object.assign({}, tv), sv);
                    } else {
                      target[k] = sv;
                    }
                  });
                  return target;
                };
                mergedVal = mergeDeep(mergedVal, parsed);
              } else {
                mergedVal = parsed; // fallback
              }
            } catch (e) {
              mergedVal = d.value;
            }
          }
          
          const mainDoc = docs[0];
          mainDoc.value = typeof mergedVal === 'string' ? mergedVal : JSON.stringify(mergedVal);
          await mainDoc.save();
          
          for (let i = 1; i < docs.length; i++) {
            await Data.findByIdAndDelete(docs[i]._id);
          }
          console.log(`✅ Merged duplicated data for key: ${key}`);
        }
      }
    } catch (err) {
      console.error('❌ Data migration error:', err.message);
    }
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
  }
};

// ============================================
// ERROR HANDLING & SERVER START
// ============================================

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found.'
  });
});

// Global error handler
app.use(errorHandler);

// Initialize Web Push
const initWebPush = async () => {
  try {
    let vapidKeys = await GlobalConstant.findOne({ key: 'VAPID_KEYS' });
    if (!vapidKeys) {
      const newKeys = webpush.generateVAPIDKeys();
      vapidKeys = await GlobalConstant.create({
        key: 'VAPID_KEYS',
        value: newKeys
      });
      console.log('✅ Generated new VAPID keys for Web Push');
    }
    webpush.setVapidDetails(
      'mailto:admin@soltantracker.com',
      vapidKeys.value.publicKey,
      vapidKeys.value.privateKey
    );
    app.locals.vapidPublicKey = vapidKeys.value.publicKey;
  } catch (err) {
    console.error('❌ Failed to initialize Web Push:', err);
  }
};

// Schedule daily check at 20:00 (8 PM)
cron.schedule('0 20 * * *', async () => {
  console.log('⏰ Running daily cron job to check incomplete tasks...');
  try {
    const d = new Date();
    const j = new Date(d.getFullYear(), 0, 1);
    const wk = `skv5-${d.getFullYear()}-${Math.ceil(((d - j) / 86400000 + j.getDay() + 1) / 7)}`;
    
    const globalData = await Data.findOne({ key: wk });
    if (!globalData) return;
    const parsedData = JSON.parse(globalData.value);
    
    const m = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const todayEn = m[d.getDay()];
    
    let dTypes = [];
    const dctDoc = await GlobalConstant.findOne({ key: 'DAY_CONTENT_TYPES' });
    if (dctDoc && dctDoc.value) dTypes = dctDoc.value[todayEn] || [];
    
    let smTasks = {};
    const smDoc = await GlobalConstant.findOne({ key: 'SM_TASKS_BY_TYPE' });
    if (smDoc && smDoc.value) smTasks = smDoc.value;
    
    const allTasks = dTypes.flatMap(type => (smTasks[type] || []).map(x => ({ key: `${type}_${x.id}` })));
    
    const users = await User.find({ isActive: true });
    
    for (const user of users) {
      if (user.role !== 'manager' || !user.branchId) continue;
      
      const branchId = user.branchId;
      const dd = parsedData[branchId]?.[todayEn] || {};
      
      const hasStories = todayEn !== "FRI";
      const sc = (dd.stories || []).filter(Boolean).length;
      const tasksDone = allTasks.filter(t => dd.tasks?.[t.key]).length;
      const totalTasks = allTasks.length;
      
      const messages = [];
      if (hasStories && sc < 6) {
        messages.push(`لم يتم استكمال الستوريز (${sc}/6).`);
      }
      if (totalTasks > 0 && tasksDone < totalTasks) {
        messages.push(`هناك مهام غير مكتملة (${tasksDone}/${totalTasks}).`);
      }
      if (!dd.published) {
        messages.push('لم يتم تأكيد النشر اليوم.');
      }
      
      if (messages.length > 0) {
        const subs = await PushSubscription.find({ userId: user._id });
        if (subs.length > 0) {
          const payload = JSON.stringify({
            title: `تذكير مهام ${branchId}`,
            body: messages.join('\n'),
            icon: '/icon-192x192.png'
          });
          for (const sub of subs) {
            try {
              await webpush.sendNotification(sub.subscription, payload);
            } catch (e) {
              if (e.statusCode === 410 || e.statusCode === 404) {
                await PushSubscription.findByIdAndDelete(sub._id);
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('❌ Cron job error:', err.message);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🗄️  Database: ${MONGODB_URI}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  mongoose.connection.close();
  process.exit(0);
});
