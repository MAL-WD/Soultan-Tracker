#!/bin/bash

# ============================================
# Soltan SM Tracker - Validation Script
# Tests if everything is properly configured
# ============================================

echo ""
echo "========================================="
echo "  Soltan SM Tracker - Setup Validation"
echo "========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0

# Test 1: Node.js installed
echo "[1] Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ PASS${NC}: Node.js $NODE_VERSION is installed"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC}: Node.js is not installed"
    ((FAIL++))
fi

# Test 2: npm installed
echo "[2] Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ PASS${NC}: npm $NPM_VERSION is installed"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC}: npm is not installed"
    ((FAIL++))
fi

# Test 3: Frontend dependencies
echo "[3] Checking frontend dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ PASS${NC}: Frontend node_modules exists"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}: node_modules not found. Run 'npm install' in root"
    ((FAIL++))
fi

# Test 4: Backend dependencies
echo "[4] Checking backend dependencies..."
if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✓ PASS${NC}: Backend node_modules exists"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}: server/node_modules not found. Run 'npm install' in server folder"
    ((FAIL++))
fi

# Test 5: .env file
echo "[5] Checking .env file..."
if [ -f "server/.env" ]; then
    echo -e "${GREEN}✓ PASS${NC}: server/.env exists"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}: server/.env not found"
    echo "   Please create it from .env.example"
    ((FAIL++))
fi

# Test 6: .env.example file
echo "[6] Checking .env.example file..."
if [ -f "server/.env.example" ]; then
    echo -e "${GREEN}✓ PASS${NC}: server/.env.example exists"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC}: server/.env.example not found"
    ((FAIL++))
fi

# Test 7: package.json (frontend)
echo "[7] Checking frontend package.json..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ PASS${NC}: Frontend package.json found"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC}: Frontend package.json not found"
    ((FAIL++))
fi

# Test 8: package.json (backend)
echo "[8] Checking backend package.json..."
if [ -f "server/package.json" ]; then
    echo -e "${GREEN}✓ PASS${NC}: Backend package.json found"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC}: Backend package.json not found"
    ((FAIL++))
fi

# Test 9: server.js exists
echo "[9] Checking server.js..."
if [ -f "server/server.js" ]; then
    echo -e "${GREEN}✓ PASS${NC}: server/server.js found"
    ((PASS++))
else
    echo -e "${RED}✗ FAIL${NC}: server/server.js not found"
    ((FAIL++))
fi

# Test 10: MongoDB connectivity (optional)
echo "[10] Checking MongoDB..."
if command -v mongosh &> /dev/null || command -v mongo &> /dev/null; then
    echo -e "${GREEN}✓ PASS${NC}: MongoDB client is available"
    ((PASS++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}: MongoDB client not found (optional)"
    ((FAIL++))
fi

echo ""
echo "========================================="
echo "  Test Results"
echo "========================================="
echo -e "Passed: ${GREEN}${PASS}${NC}"
echo -e "Failed: ${RED}${FAIL}${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready to start.${NC}"
    echo ""
    echo "Run the project with:"
    echo "  Terminal 1: cd server && npm start"
    echo "  Terminal 2: npm run dev"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "Quick fixes:"
    echo "  1. npm install (in root folder)"
    echo "  2. cd server && npm install"
    echo "  3. Copy server/.env.example to server/.env"
    echo ""
    exit 1
fi
