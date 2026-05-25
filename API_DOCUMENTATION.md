# 📡 API Documentation - Soltan SM Tracker

## ✅ Available APIs

Your backend has all the necessary APIs for creating and updating states. Here's what's available:

### 1. **Authentication APIs**

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "pass123"
}

Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "user123",
    "role": "admin|manager",
    "branchId": "400|laknab|bidando"
  }
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "pass123",
  "role": "manager",
  "branchId": "400"
}

Response: Same as login
```

---

### 2. **Storage API** (Protected - Requires Token)

This is a **generic key-value storage** that handles ALL state updates:

#### Get Data
```http
GET /api/storage/:key
Headers:
  x-auth-token: your_jwt_token

Response:
{
  "value": "your_stored_data_here"
}
```

#### Create/Update Data (Upsert)
```http
POST /api/storage
Content-Type: application/json
Headers:
  x-auth-token: your_jwt_token

{
  "key": "data_key",
  "value": "any_string_data_here"
}

Response:
{
  "success": true
}
```

---

## 📊 What States Are Stored?

Your frontend stores these data with specific keys:

| State | Key Pattern | Content |
|-------|-------------|---------|
| **Main Data** | `{week}` | Tasks, stories, status for each day/branch |
| **Month Plan** | `{week}-mp` | Monthly planning |
| **B2B Tasks** | `{week}-b2b` | B2B task tracking |
| **Branch Names** | `bn5` | Custom branch names |
| **Activities** | `{week}-act` | Activity log |
| **Comments** | `{week}-com` | Comments/notes |

**Example:** For week 202601, keys would be:
- `202601` - Main data
- `202601-mp` - Month plan
- `202601-b2b` - B2B tasks
- `202601-act` - Activities
- `202601-com` - Comments
- `bn5` - Branch names (same for all weeks)

---

## 💻 How Frontend Uses These APIs

### Save Data Example:
```javascript
const token = localStorage.getItem("token");

// Save tasks/stories data
await fetch("http://localhost:5000/api/storage", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "x-auth-token": token 
  },
  body: JSON.stringify({
    key: "202601",
    value: JSON.stringify({ /* all tasks and stories */ })
  })
});
```

### Load Data Example:
```javascript
const token = localStorage.getItem("token");

const response = await fetch("http://localhost:5000/api/storage/202601", {
  headers: { "x-auth-token": token }
});
const data = await response.json();
const tasksData = JSON.parse(data.value);
```

---

## ✅ Summary

**YES**, all the APIs needed for creating and updating states are already there! ✅

✔️ Authentication (login/register)  
✔️ Generic storage for all data types  
✔️ Create new entries (upsert)  
✔️ Update existing entries  
✔️ Retrieve data  

The storage API is flexible - it stores any data as JSON strings with custom keys, so you can add more states in the future without changing the backend!

---

## 🔧 To Add New State Types:

If you want to add a new state in the future, just:

1. Create a new state in frontend (e.g., `const [newState, setNewState] = useState({})`)
2. Use the same storage API with a new key:
   ```javascript
   await cloudStorage.set("new-state-key", JSON.stringify(newState));
   ```

That's it! No backend changes needed. 🚀
