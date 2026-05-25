# 🚀 Soltan SM Tracker - Setup Guide for Team Members

Welcome! This guide will help you set up the Soltan SM Tracker project on your machine.

## ✅ Prerequisites

Before you start, install these on your machine:

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - After installation, verify: `node --version` and `npm --version`

2. **MongoDB**
   - **Option A (Local):** Download from https://www.mongodb.com/try/download/community
   - **Option B (Cloud - Recommended):** Use MongoDB Atlas (free tier) at https://www.mongodb.com/cloud/atlas
   - Install **MongoDB Compass** too (GUI for managing databases): https://www.mongodb.com/products/compass

3. **Git** - https://git-scm.com/
4. **VS Code** (Recommended IDE) - https://code.visualstudio.com/

## 📥 Step 1: Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd soltan-tracker

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## 🔐 Step 2: Setup Environment Variables

Create a file named `.env` in the `server` folder (NOT in the root):

```env
MONGODB_URI=mongodb://localhost:27017/soltan-tracker
PORT=5000
JWT_SECRET=your_very_secret_key_change_this_123
NODE_ENV=development
```

**If using MongoDB Atlas instead:**
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/soltan-tracker
PORT=5000
JWT_SECRET=your_very_secret_key_change_this_123
NODE_ENV=development
```

⚠️ **Important:** 
- Never commit `.env` to git (it's private!)
- Make sure it's in `server/.env`, not in the root

## 🗄️ Step 3: Start MongoDB

### If using Local MongoDB:
- **Windows:** MongoDB should auto-start, or open Services and find MongoDB
- **Mac:** `brew services start mongodb-community`
- **Linux:** `sudo systemctl start mongod`

### If using MongoDB Atlas:
- No action needed, it's in the cloud

## 🎮 Step 4: Run the Project

You need **2 terminal windows** (or 2 terminal tabs in VS Code):

### Terminal 1 - Backend Server:
```bash
cd server
npm start
```
✅ You should see: `Server running on port 5000` or similar

### Terminal 2 - Frontend:
```bash
npm run dev
```
✅ You should see: `Local: http://localhost:5173/`

### Open in Browser:
Go to http://localhost:5173 🎉

## 🛠️ Using VS Code (Recommended)

1. Open VS Code
2. File → Open Folder → Select `soltan-tracker`
3. Terminal → New Terminal (creates Terminal 1)
4. Click "+" icon to create Terminal 2
5. In Terminal 1: `cd server && npm start`
6. In Terminal 2: `npm run dev`
7. VS Code will open the app, or manually go to http://localhost:5173

## 📝 Available Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Check code quality |
| `npm start` (in server/) | Start backend server |
| `npx nodemon server.js` (in server/) | Start backend with auto-reload |

## 🗄️ Viewing Database Data

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017` (or your Atlas connection)
3. Browse your databases and collections

## ❌ Troubleshooting

### "Port 5000 is already in use"
```bash
# Windows: Find and kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux: 
lsof -i :5000
kill -9 <PID>
```

### "Cannot find module" error
```bash
# Try this in BOTH the root and server folders:
rm -rf node_modules package-lock.json
npm install
```

### MongoDB connection failed
- Check if MongoDB is running
- Verify your connection string in `.env`
- If using Atlas, add your IP address to whitelist

### "EADDRINUSE: address already in use :::5173"
Change port in `vite.config.js` or wait for other process to finish

## 📚 Useful Links

- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev/
- Express.js: https://expressjs.com/
- MongoDB: https://docs.mongodb.com/
- VS Code: https://code.visualstudio.com/docs

## ❓ Questions?

Ask a team member or check the project repository!

---
**Happy coding! 🚀**
