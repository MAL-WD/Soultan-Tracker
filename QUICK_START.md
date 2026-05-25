# 🚀 Quick Start - One Click Setup

## For Windows Users:
1. Double-click `setup.bat`
2. Wait for it to finish (5-10 minutes first time)
3. Two terminals will open automatically
4. Go to http://localhost:5173

## For Mac/Linux Users:
1. Open terminal in project folder
2. Run: `chmod +x setup.sh && ./setup.sh`
3. Two terminals will open automatically
4. Go to http://localhost:5173

---

## What the script does:
- ✅ Installs all dependencies
- ✅ Creates .env file (edit it with your MongoDB connection)
- ✅ Starts backend server
- ✅ Starts frontend dev server
- ✅ Opens http://localhost:5173

**That's it!** 🎉

---

## Requirements (one-time install):
- Node.js: https://nodejs.org/
- MongoDB: https://www.mongodb.com/ (or use MongoDB Atlas - free cloud version)

---

## Troubleshooting:

**"Port already in use"**
- Close the terminal and try again

**"Cannot find module"**
- Delete `node_modules` folders and run script again

**MongoDB won't connect**
- Start MongoDB manually
- Or change MONGODB_URI in `server/.env` to your MongoDB connection string

---

**Questions?** Ask your team lead!
