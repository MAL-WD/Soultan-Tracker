#!/bin/bash

# ============================================
# Soltan SM Tracker - Automated Setup Script
# ============================================

clear

echo ""
echo "========================================"
echo "  Soltan SM Tracker Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ ERROR: Node.js is not installed!"
    echo "Please download and install Node.js from: https://nodejs.org/"
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ Node.js found"
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error installing frontend dependencies"
    read -p "Press Enter to exit..."
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error installing backend dependencies"
    cd ..
    read -p "Press Enter to exit..."
    exit 1
fi
echo "✅ Backend dependencies installed"
echo ""

# Check if .env exists, if not create from .env.example
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ .env file created from .env.example"
        echo "⚠️  IMPORTANT: Edit server/.env and update MONGODB_URI, JWT_SECRET"
    else
        echo "⚠️  .env.example not found, creating basic .env..."
        cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/soltan-tracker
PORT=5000
JWT_SECRET=your_secret_key_change_this
NODE_ENV=development
EOF
        echo "✅ .env file created"
    fi
else
    echo "✅ .env already exists"
fi

echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Starting application..."
echo ""
echo "Opening 2 terminals:"
echo "  - Terminal 1: Backend server (port 5000)"
echo "  - Terminal 2: Frontend dev server (port 5173)"
echo ""

cd ..

# Start backend in new terminal
open -a Terminal <<EOF
cd "$(pwd)/server" && npm start
EOF

# Wait a bit then start frontend in new terminal
sleep 3
open -a Terminal <<EOF
cd "$(pwd)" && npm run dev
EOF

echo ""
echo "========================================"
echo "🎉 Application is starting!"
echo "========================================"
echo ""
echo "Open your browser and go to: http://localhost:5173"
echo ""
