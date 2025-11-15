# MongoDB Data Access Guide

## 🎯 Quick Start - View Your Database

Your MongoDB connection: `mongodb://localhost:27017/deshswaar_passport`

---

## ⚠️ IMPORTANT: Start MongoDB First

**MongoDB is currently NOT RUNNING**. Before using any method below, you must start MongoDB:

### Option A: Start Local MongoDB (Windows)
```powershell
# Check if MongoDB is installed
Get-Service -Name *mongo*

# If installed, start the service
Start-Service MongoDB

# Or run mongod manually
mongod --dbpath "C:\data\db"
```

### Option B: Use MongoDB Atlas (Cloud - Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster
4. Get connection string
5. Update `.env` file in backend folder with Atlas URI

---

## 📊 Method 1: MongoDB Compass (EASIEST - Recommended)

### Steps:
1. **Install MongoDB Compass**: https://www.mongodb.com/try/download/compass
2. **Open Compass** and click "New Connection"
3. **Paste connection string**:
   ```
   mongodb://localhost:27017
   ```
   (Or your Atlas URI if using cloud)
4. **Connect**
5. **Navigate**: `deshswaar_passport` database → `users` collection
6. **View users**: Click "Find" button
7. **Hide passwords**: In projection box, enter: `{ "password": 0 }`

### Benefits:
- ✅ Visual interface (no commands needed)
- ✅ Easy filtering and searching
- ✅ Export data with one click
- ✅ Edit documents directly

---

## 💻 Method 2: Node.js Script (ALREADY CREATED)

We've created a script for you at `scripts/listUsers.js`

### Run it:
```powershell
cd U:\OPBRIS\deshswaar-passport-system\scripts
node listUsers.js
```

### What it does:
- ✅ Lists all users (without passwords)
- ✅ Shows total count
- ✅ Displays user details
- ✅ Checks for applications too

### Export to file:
```powershell
node exportUsers.js
```
This creates JSON and CSV files in `scripts/exports/` folder

---

## 🔍 Method 3: mongosh (Terminal)

### Install mongosh:
Download from: https://www.mongodb.com/try/download/shell

### Connect and query:
```powershell
# Connect to database
mongosh "mongodb://localhost:27017/deshswaar_passport"

# Inside mongosh:
show collections                        # List all collections
db.users.count()                       # Count users
db.users.find().pretty()               # View all users (with passwords!)
db.users.find({}, {password: 0}).pretty()  # View without passwords
db.users.findOne({ email: "user@example.com" })  # Find specific user
db.applications.count()                # Count applications
```

---

## 🚀 Method 4: Backend API

### Start your backend:
```powershell
cd U:\OPBRIS\deshswaar-passport-system\backend
npm start
```

### If your API has admin routes, call them:
```powershell
# Example (replace with your actual endpoint and token)
Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/profile' -Headers @{ Authorization = 'Bearer YOUR_JWT_TOKEN' }
```

---

## 📥 Method 5: Export with mongoexport

### Install MongoDB Database Tools:
https://www.mongodb.com/try/download/database-tools

### Export commands:
```powershell
# Export to JSON
mongoexport --uri="mongodb://localhost:27017/deshswaar_passport" --collection=users --out=users.json --pretty --excludeFields=password

# Export to CSV
mongoexport --uri="mongodb://localhost:27017/deshswaar_passport" --collection=users --type=csv --fields="_id,firstName,lastName,email,phone,createdAt" --out=users.csv
```

---

## 🔒 Security Notes

**NEVER expose passwords!** Always use one of these:
- MongoDB Compass: Add projection `{ "password": 0 }`
- mongosh: Use `.find({}, {password: 0})`
- Scripts: Already exclude passwords
- mongoexport: Use `--excludeFields=password`

---

## 🆘 Troubleshooting

### "Connection refused" error
- MongoDB is not running
- Start MongoDB service (see top of document)
- Or use MongoDB Atlas

### "No users found"
- Database is empty
- Register users through frontend: http://localhost:8000/register.html
- Submit applications: http://localhost:8000/apply.html

### "mongosh not found"
- Install from: https://www.mongodb.com/try/download/shell
- Or use MongoDB Compass instead (easier)

---

## 📝 Next Steps

1. **Start MongoDB** (most important!)
   ```powershell
   Start-Service MongoDB
   ```

2. **Use MongoDB Compass** (easiest way):
   - Download: https://www.mongodb.com/try/download/compass
   - Connect to: `mongodb://localhost:27017`
   - Browse `deshswaar_passport` → `users`

3. **Or run our script**:
   ```powershell
   cd U:\OPBRIS\deshswaar-passport-system\scripts
   node listUsers.js
   ```

---

## 📞 Common Queries

```javascript
// Find user by email
db.users.findOne({ email: "user@example.com" })

// Find all users created today
db.users.find({ createdAt: { $gte: new Date(new Date().setHours(0,0,0,0)) }})

// Count verified users (if you have isVerified field)
db.users.count({ isVerified: true })

// Find users by name
db.users.find({ firstName: /john/i })

// Get recent applications
db.applications.find().sort({ createdAt: -1 }).limit(10)
```

---

**Need help?** Check each method and choose the one that works best for you!
