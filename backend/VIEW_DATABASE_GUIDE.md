# How to View Your Registered Users in MongoDB Compass

## Step-by-Step Visual Guide

### Step 1: Open MongoDB Compass
1. Launch **MongoDB Compass** application on your computer
2. If you don't have it, download from: https://www.mongodb.com/try/download/compass

---

### Step 2: Connect to Your Database

1. In the connection screen, you'll see a text box labeled **"URI"** or **"Connection String"**

2. **Copy and paste this EXACT connection string:**
   ```
   mongodb+srv://utkarsh31983_db_user:Deshdwaar_db1@cluster0.st1m4ka.mongodb.net/?appName=Cluster0
   ```

3. Click the green **"Connect"** button

4. Wait a few seconds while it connects to MongoDB Atlas

---

### Step 3: Navigate to Your Database

Once connected, you'll see the left sidebar with databases:

1. Look for a database named **`deshswaar`** 
   - This is your application database
   - If you don't see it, it might be under **`test`** database

2. **Click on `deshswaar`** to expand it
   - You'll see collections (tables) underneath

3. You should see these collections:
   - **`users`** ← Your registered users are here!
   - **`applications`** ← Passport applications (if any)

---

### Step 4: View All Registered Users

1. **Click on the `users` collection**
   - This opens the collection viewer in the main panel

2. You'll now see a **Documents** tab showing all user records

3. Each row represents one registered user

4. You can see:
   - Total document count at the top
   - Individual user documents with all their fields

---

### Step 5: Examine a User Document

Click on any user document to expand it. You'll see fields like:

```javascript
{
  "_id": ObjectId("673abc123..."),           // Unique MongoDB ID
  "firstName": "John",                        // User's first name
  "lastName": "Doe",                          // User's last name
  "email": "john.doe@example.com",           // Email (unique)
  "password": "$2b$12$aB3cD4eF5...",          // ⚠️ HASHED password (secure!)
  "phone": "+919876543210",                   // Phone number
  "dateOfBirth": ISODate("1990-01-15..."),   // Birth date
  "gender": "male",                           // Gender
  "maritalStatus": "single",                  // Marital status
  "aadharNumber": "123456789012",            // Aadhar number (unique)
  "panNumber": null,                          // PAN (optional)
  "profilePicture": null,                     // Profile pic (if uploaded)
  "isVerified": false,                        // Email verification status
  "isActive": true,                           // Account active status
  "role": "user",                             // User role
  "loginAttempts": 0,                         // Failed login count
  "lastLogin": ISODate("2025-11-10..."),     // Last login timestamp
  "createdAt": ISODate("2025-11-10..."),     // Registration date
  "updatedAt": ISODate("2025-11-10..."),     // Last update date
  "__v": 0                                    // Version key (Mongoose)
}
```

---

### Step 6: Search for a Specific User

**Method 1: Using Filter Bar**

1. At the top of the documents view, find the **Filter** input box
2. To find a user by email, type:
   ```json
   { "email": "john.doe@example.com" }
   ```
3. Press **Enter** or click **Find**
4. Only matching users will be displayed

**Method 2: Other Search Options**

Find by phone:
```json
{ "phone": "+919876543210" }
```

Find by Aadhar:
```json
{ "aadharNumber": "123456789012" }
```

Find users created today:
```json
{ "createdAt": { "$gte": ISODate("2025-11-10T00:00:00.000Z") } }
```

Find all active users:
```json
{ "isActive": true }
```

---

### Step 7: Verify Password Security

1. Look at the **`password`** field of any user
2. It should look like: `$2b$12$abcdefg...` (long random string)
3. This is a **bcrypt hash** - NOT the actual password
4. **✅ This means passwords are secure and cannot be reversed!**

If you see the actual password in plain text, that's a security issue.

---

### Step 8: View Recent Registrations

To see the most recently registered users:

1. Click the **Sort** button (or find sort options)
2. Sort by `createdAt` in **descending order (-1)**
3. The newest users will appear at the top

Or use this filter to see today's registrations:
```json
{ "createdAt": { "$gte": ISODate("2025-11-10T00:00:00.000Z") } }
```

---

## Additional Viewing Options

### View in Table Format
- Some versions of Compass have a **Table View** tab
- This shows data in a spreadsheet-like format
- Easier to scan multiple records

### View in JSON Format
- Click on **Document** tab
- Shows the raw MongoDB JSON
- Useful for developers

### Export Data
- Click **Export** button at the top
- Export to JSON or CSV
- Useful for backups or analysis

---

## Quick Reference: MongoDB Compass Actions

| Action | How to Do It |
|--------|--------------|
| **Connect** | Paste connection string → Click Connect |
| **View Users** | Databases → deshswaar → users |
| **Search** | Use Filter bar with JSON query |
| **Sort** | Click sort icon → Choose field and order |
| **Refresh** | Click refresh icon to see new data |
| **Delete User** | Select document → Click trash icon → Confirm |
| **Edit User** | Click on document → Edit fields → Update |

---

## Troubleshooting

### ❌ Can't See `deshswaar` Database
**Solution:** 
- Check the `test` database instead
- Make sure you've registered at least one user
- Refresh the database list (click refresh icon)

### ❌ `users` Collection is Empty
**Solution:**
- Verify your server is connected to the right database
- Register a new user through the API
- Check server logs for errors
- Refresh Compass (press F5 or click refresh)

### ❌ Connection Failed
**Solution:**
- Check your internet connection
- Verify the connection string is correct
- Your IP might need to be whitelisted in MongoDB Atlas
  - Go to: MongoDB Atlas → Network Access → Add IP Address → "Allow Access from Anywhere" (for testing)

### ❌ Authentication Failed
**Solution:**
- Verify username and password in connection string
- Check MongoDB Atlas user permissions
- Database user might have been deleted or password changed

---

## Using MongoDB Shell (Alternative Method)

If you prefer command line:

1. Install MongoDB Shell: https://www.mongodb.com/try/download/shell

2. Connect:
```bash
mongosh "mongodb+srv://utkarsh31983_db_user:Deshdwaar_db1@cluster0.st1m4ka.mongodb.net/?appName=Cluster0"
```

3. View users:
```javascript
use deshswaar
db.users.find().pretty()
```

4. Find specific user:
```javascript
db.users.findOne({ email: "john.doe@example.com" })
```

5. Count users:
```javascript
db.users.countDocuments()
```

6. View latest 5 users:
```javascript
db.users.find().sort({ createdAt: -1 }).limit(5).pretty()
```

---

## What to Look For When Verifying Registration

✅ **Check these things in MongoDB Compass:**

1. **User exists** in `users` collection
2. **Email** matches what you registered with
3. **Password is hashed** (starts with `$2b$12$`)
4. **createdAt timestamp** is recent
5. **All required fields** are present:
   - firstName, lastName, email, phone
   - dateOfBirth, gender, maritalStatus
   - aadharNumber
6. **isActive** is `true`
7. **role** is `"user"`
8. **No sensitive data** is exposed

---

## Real-World Example

After registering with:
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

In MongoDB Compass, you should see:
```json
{
  "email": "john.doe@example.com",
  "password": "$2b$12$XyZ... (70 chars)", ← NOT "SecurePass123!"
  "createdAt": "2025-11-10T13:45:30.123Z"
}
```

**✅ Password is HASHED = Secure!**
**❌ Password in plain text = Security Problem!**

---

## Next Steps

Once you've verified your data in Compass:

1. ✅ Register multiple test users with different data
2. ✅ Test login with correct and incorrect passwords
3. ✅ Verify `lastLogin` timestamp updates after login
4. ✅ Test password change functionality
5. ✅ Check that duplicate emails are rejected

Happy testing! 🎉
