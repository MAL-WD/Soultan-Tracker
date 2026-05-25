# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## ❌ "Port 5000 already in use"

**Problem:** Backend server won't start because port 5000 is already in use

**Solutions:**

### Windows:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number from above)
taskkill /PID 12345 /F

# Or change the port in .env
# PORT=5001
```

### Mac/Linux:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with the number)
kill -9 12345

# Or change the port in .env
# PORT=5001
```

---

## ❌ "MongoDB Connection Error"

**Problem:** Backend can't connect to MongoDB

### Check if MongoDB is Running:

**Windows:**
- Open Services (services.msc)
- Look for "MongoDB"
- If not running, right-click → Start

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

### If Using MongoDB Atlas (Cloud):

1. Check connection string in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/soltan-tracker
   ```

2. Verify credentials are correct

3. Add your IP to MongoDB Atlas whitelist:
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Network Access" → "Add IP Address"
   - Add your current IP (or 0.0.0.0/0 for testing only)

4. Test connection:
   ```bash
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/soltan-tracker"
   ```

---

## ❌ "Cannot find module" error

**Problem:** Node packages not installed

**Solutions:**

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Or clean install if still failing:
rm -rf node_modules package-lock.json
npm install

cd server
rm -rf node_modules package-lock.json
npm install
cd ..
```

---

## ❌ "npm: command not found"

**Problem:** Node.js/npm is not installed

**Solution:**

1. Download Node.js from https://nodejs.org/ (LTS version)
2. Install it
3. Restart terminal
4. Verify: `node --version` and `npm --version`

---

## ❌ "EADDRINUSE: address already in use :::5173"

**Problem:** Frontend port 5173 is already in use

**Solution 1:** Kill the process
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

**Solution 2:** Change port in `vite.config.js`
```javascript
export default {
  server: {
    port: 5174  // Change to different port
  }
}
```

---

## ❌ "Token is not valid" or "401 Unauthorized"

**Problem:** Authentication error

**Solutions:**

1. **Token expired** → Login again
   ```javascript
   localStorage.removeItem('token');
   // Then login again in the app
   ```

2. **Token not sent** → Make sure to include header:
   ```javascript
   headers: {
     'x-auth-token': token
   }
   ```

3. **JWT_SECRET mismatch** → Make sure `JWT_SECRET` in `.env` is the same
   ```bash
   # If you changed it, logout all users and they'll need to login again
   ```

---

## ❌ "CORS error" - Request blocked by browser

**Problem:** Frontend can't communicate with backend

**Solutions:**

1. **Check backend is running:** `http://localhost:5000/api/health`
   
2. **Verify CORS is enabled in server:**
   ```javascript
   app.use(cors()); // Should be in server.js
   ```

3. **Check API URL in frontend:** Should be `http://localhost:5000/api`

4. **If using different port:** Update the API URL:
   ```javascript
   // In App.jsx
   const API_URL = "http://localhost:5001/api"; // Change 5000 to your port
   ```

---

## ❌ "Error: connect ECONNREFUSED 127.0.0.1:27017"

**Problem:** MongoDB not running at default location

**Solutions:**

1. Start MongoDB:
   ```bash
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows - Use Services or command line
   mongod
   ```

2. Or use MongoDB Atlas (cloud):
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/soltan-tracker
   ```

---

## ❌ ".env file not found"

**Problem:** Backend can't load environment variables

**Solution:**

```bash
# Create .env from example
cd server
cp .env.example .env  # Mac/Linux
# OR
copy .env.example .env  # Windows

# Edit .env and add your values
```

---

## ❌ "Login failed" - Invalid credentials

**Problem:** Can't login even with correct username/password

**Solutions:**

1. **Use default admin user:**
   ```
   Username: admin
   Password: admin123
   ```

2. **Reset database:**
   ```bash
   # Delete all data
   # Stop the server
   # In MongoDB, drop the database:
   mongosh
   > use soltan-tracker
   > db.dropDatabase()
   ```
   
3. **Create new admin user:**
   - Stop server
   - Reset database
   - Start server (will create new admin user)

---

## ❌ Frontend not updating when data changes

**Problem:** State changes not syncing to database

**Check:**

1. Check browser console for errors (F12)
2. Check server logs for errors
3. Verify token is valid
4. Make sure internet/MongoDB connection is working
5. Try refreshing the page
6. Check if data is actually saved:
   ```bash
   mongosh
   > use soltan-tracker
   > db.data.find()
   ```

---

## ❌ Setup script won't run

**Problem:** `.bat` or `.sh` file won't execute

**Windows:**
```powershell
# Right-click on setup.bat → Run as administrator
# Or in PowerShell:
powershell -ExecutionPolicy Bypass -File setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

---

## ✅ Quick Health Check

Run this to verify everything:

**Windows:**
```bash
validate.bat
```

**Mac/Linux:**
```bash
chmod +x validate.sh
./validate.sh
```

---

## 📞 Getting Help

1. **Check this guide first**
2. **Look at server logs** when you run `npm start`
3. **Check browser console** (F12 → Console tab)
4. **Verify MongoDB is running:** `http://localhost:5000/api/health`
5. **Ask a team member**

---

## 🆘 Nuclear Option (Reset Everything)

If all else fails:

```bash
# Stop all servers (Ctrl+C in terminals)

# Windows
rmdir /s node_modules
rmdir /s server\node_modules
del package-lock.json
del server\package-lock.json

# Mac/Linux
rm -rf node_modules
rm -rf server/node_modules
rm package-lock.json
rm server/package-lock.json

# Reinstall
npm install
cd server && npm install && cd ..

# Reset MongoDB
mongosh
> use soltan-tracker
> db.dropDatabase()

# Start fresh
# Terminal 1: cd server && npm start
# Terminal 2: npm run dev
```

---

**Still stuck?** Check the API documentation and ask your team!
