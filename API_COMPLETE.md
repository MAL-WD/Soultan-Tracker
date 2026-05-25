# 📡 Complete API Reference - Soltan SM Tracker

## Base URL
```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

### 1. **Register New User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "role": "manager",        // Optional: "admin" or "manager"
  "branchId": "400"         // Optional: "400", "laknab", or "bidando"
}

Response (200):
{
  "success": true,
  "message": "User registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "newuser",
    "role": "manager",
    "branchId": "400"
  }
}

Error (400):
{
  "success": false,
  "error": "Username already exists. Please choose another."
}
```

---

### 2. **Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response (200):
{
  "success": true,
  "message": "Logged in successfully.",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "role": "admin",
    "branchId": "400"
  }
}

Error (400):
{
  "success": false,
  "error": "Invalid username or password."
}
```

**Default Admin User** (created on first run):
- Username: `admin`
- Password: `admin123`

---

### 3. **Get Current User Profile**
```http
GET /api/auth/me
Headers:
  x-auth-token: eyJhbGciOiJIUzI1NiIs...

Response (200):
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "role": "admin",
    "branchId": "400",
    "createdAt": "2026-05-12T10:30:00.000Z",
    "lastLogin": "2026-05-12T14:45:30.000Z",
    "isActive": true
  }
}
```

---

## 💾 Storage Endpoints (Protected - Requires Token)

All storage endpoints require the `x-auth-token` header with a valid JWT token.

### 4. **Get Single Data Item**
```http
GET /api/storage/:key
Headers:
  x-auth-token: eyJhbGciOiJIUzI1NiIs...

Example: GET /api/storage/202601

Response (200):
{
  "success": true,
  "data": {
    "value": "{\"400\":{\"SAT\":{...}}}",
    "createdAt": "2026-05-12T10:30:00.000Z",
    "updatedAt": "2026-05-12T14:45:30.000Z"
  }
}

If not found (200):
{
  "success": true,
  "data": null
}
```

---

### 5. **Get All User Data**
```http
GET /api/storage
Headers:
  x-auth-token: eyJhbGciOiJIUzI1NiIs...

Response (200):
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "key": "202601",
      "value": "{...}",
      "createdAt": "2026-05-12T10:30:00.000Z",
      "updatedAt": "2026-05-12T14:45:30.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "key": "202601-mp",
      "value": "{...}",
      "createdAt": "2026-05-12T10:31:00.000Z",
      "updatedAt": "2026-05-12T14:46:30.000Z"
    }
    // ... more items
  ]
}
```

---

### 6. **Create or Update Data**
```http
POST /api/storage
Content-Type: application/json
Headers:
  x-auth-token: eyJhbGciOiJIUzI1NiIs...

{
  "key": "202601",
  "value": "{\"400\":{\"SAT\":{\"tasks\":{\"research\":true}}},\"laknab\":{...}}"
}

Response (200):
{
  "success": true,
  "message": "Data saved successfully.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "key": "202601",
    "value": "{...}",
    "userId": "507f1f77bcf86cd799439010",
    "createdAt": "2026-05-12T10:30:00.000Z",
    "updatedAt": "2026-05-12T14:45:30.000Z"
  }
}

Error (400):
{
  "success": false,
  "error": "Key and value are required."
}
```

---

### 7. **Delete Data**
```http
DELETE /api/storage/:key
Headers:
  x-auth-token: eyJhbGciOiJIUzI1NiIs...

Example: DELETE /api/storage/202601

Response (200):
{
  "success": true,
  "message": "Data deleted successfully."
}

Error (404):
{
  "success": false,
  "error": "Data not found."
}
```

---

## 📊 Activity Log Endpoints (Protected)

### 8. **Get User Activities**
```http
GET /api/activities?limit=50
Headers:
  x-auth-token: eyJhbGciOiJIUzI1NiIs...

Query Parameters:
  - limit: (Optional) Number of activities to return (default: 50)

Response (200):
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "userId": "507f1f77bcf86cd799439010",
      "action": "login",
      "dataKey": null,
      "timestamp": "2026-05-12T14:45:30.000Z",
      "details": "Login successful"
    },
    {
      "_id": "507f1f77bcf86cd799439021",
      "userId": "507f1f77bcf86cd799439010",
      "action": "update",
      "dataKey": "202601",
      "timestamp": "2026-05-12T14:46:15.000Z",
      "details": "Data updated with key: 202601"
    },
    {
      "_id": "507f1f77bcf86cd799439022",
      "userId": "507f1f77bcf86cd799439010",
      "action": "create",
      "dataKey": "202601-mp",
      "timestamp": "2026-05-12T14:47:00.000Z",
      "details": "Data created with key: 202601-mp"
    }
  ]
}

Possible Actions:
  - "create" - Data was created
  - "update" - Data was updated
  - "delete" - Data was deleted
  - "login" - User logged in
  - "logout" - User logged out
```

---

## 🏥 Health Check Endpoint

### 9. **Server Health Status**
```http
GET /api/health

Response (200):
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-12T14:48:00.000Z",
  "mongodb": "Connected"
}
```

---

## 📝 Data Storage Keys Reference

Your frontend uses these keys for storing different types of data:

| Data Type | Key Pattern | Example |
|-----------|-------------|---------|
| Main Tasks & Stories | `{week}` | `202601` |
| Month Plan | `{week}-mp` | `202601-mp` |
| B2B Tasks | `{week}-b2b` | `202601-b2b` |
| Activities Log | `{week}-act` | `202601-act` |
| Comments | `{week}-com` | `202601-com` |
| Branch Names | `bn5` | `bn5` |

**Week Format:** YYYYWW (Year + Week number)
- Example: 202601 = Week 1 of 2026

---

## ⚡ Quick Integration Examples

### JavaScript/Fetch Example

```javascript
// Get token from login
const token = localStorage.getItem('token');

// Save data
async function saveData(key, value) {
  const response = await fetch('http://localhost:5000/api/storage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify({ key, value: JSON.stringify(value) })
  });
  return await response.json();
}

// Load data
async function loadData(key) {
  const response = await fetch(`http://localhost:5000/api/storage/${key}`, {
    headers: { 'x-auth-token': token }
  });
  const data = await response.json();
  return data.data ? JSON.parse(data.data.value) : null;
}

// Get activities
async function getActivities(limit = 50) {
  const response = await fetch(`http://localhost:5000/api/activities?limit=${limit}`, {
    headers: { 'x-auth-token': token }
  });
  return await response.json();
}
```

---

## 🔒 Authentication Flow

1. **Register/Login** → Get JWT token
2. **Store token** in `localStorage.setItem('token', token)`
3. **Include token** in all protected requests: `x-auth-token: token`
4. **Token valid** for 7 days
5. **Token expires** → User needs to login again

---

## ❌ Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error |

---

## 🚀 New Features Added

✅ **Better Error Handling** - Clear error messages for all cases  
✅ **Activity Logging** - Track all user actions  
✅ **User Profiles** - Get current user info  
✅ **Data Deletion** - Delete stored data  
✅ **Get All Data** - Retrieve all user data  
✅ **Input Validation** - Validate all inputs  
✅ **Health Check** - Monitor server status  
✅ **Database Initialization** - Auto-create admin user  
✅ **Timestamps** - Track creation and update times  
✅ **Security** - Token-based authentication  

---

## 📞 Support

For issues or questions, check:
- Server logs: `npm start` output
- MongoDB connection: `http://localhost:5000/api/health`
- Database errors: Check `.env` file configuration
