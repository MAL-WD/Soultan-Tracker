const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/soltan-tracker';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'manager'], default: 'manager' },
  branchId: { type: String, default: null }
});

const User = mongoose.model('User', UserSchema);

async function init() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

  const admin = new User({
    username: 'admin',
    password: hashedPassword,
    role: 'admin'
  });

  try {
    await admin.save();
    console.log('✅ Admin user created: admin / admin123');
  } catch (err) {
    console.log('❌ Admin user already exists');
  }
  
  process.exit();
}

init();
