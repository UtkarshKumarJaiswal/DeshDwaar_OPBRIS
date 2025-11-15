# Testing Signup & Login + Viewing Data in MongoDB Compass

## Prerequisites
- MongoDB Compass installed ([Download here](https://www.mongodb.com/try/download/compass))
- Backend server dependencies installed (`npm install`)

---

## Step 1: Start the Backend Server

Open PowerShell in the `backend` directory and run:

```powershell
$env:MONGODB_URI = 'mongodb+srv://utkarsh31983_db_user:Deshdwaar_db1@cluster0.st1m4ka.mongodb.net/?appName=Cluster0'
$env:JWT_SECRET = 'my-super-secret-jwt-key-change-in-production'
$env:FRONTEND_URL = 'http://localhost:3000'
$env:NODE_ENV = 'development'
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Deshswaar API Server running on port 5000
🌐 Environment: development
📊 Health check: http://localhost:5000/api/health
```

---

## Step 2: Test Registration (Signup)

### Option A: Using PowerShell (Invoke-RestMethod)

```powershell
$body = @{
    firstName = "John"
    lastName = "Doe"
    email = "john.doe@example.com"
    phone = "+919876543210"
    password = "SecurePass123!"
    confirmPassword = "SecurePass123!"
    dateOfBirth = "1990-01-15"
    gender = "male"
    maritalStatus = "single"
    aadharNumber = "123456789012"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$response | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+919876543210"
  }
}
```

**Save the token** - you'll need it for authenticated requests!

### Option B: Using curl

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john.doe@example.com\",\"phone\":\"+919876543210\",\"password\":\"SecurePass123!\",\"confirmPassword\":\"SecurePass123!\",\"dateOfBirth\":\"1990-01-15\",\"gender\":\"male\",\"maritalStatus\":\"single\",\"aadharNumber\":\"123456789012\"}"
```

---

## Step 3: Test Login

### Using PowerShell

```powershell
$loginBody = @{
    email = "john.doe@example.com"
    password = "SecurePass123!"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$loginResponse | ConvertTo-Json

# Save the token for later use
$token = $loginResponse.token
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+919876543210"
  }
}
```

---

## Step 4: Test Protected Endpoint (Get Profile)

### Using PowerShell

```powershell
# Use the token from login
$headers = @{
    "Authorization" = "Bearer $token"
}

$profileResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method GET -Headers $headers
$profileResponse | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+919876543210",
    "dateOfBirth": "1990-01-15T00:00:00.000Z",
    "gender": "male",
    "maritalStatus": "single",
    "aadharNumber": "123456789012",
    ...
  }
}
```

---

## Step 5: View Data in MongoDB Compass

### Connect to Database

1. **Open MongoDB Compass**

2. **Paste Connection String:**
   ```
   mongodb+srv://utkarsh31983_db_user:Deshdwaar_db1@cluster0.st1m4ka.mongodb.net/?appName=Cluster0
   ```

3. **Click "Connect"**

### Find Your Database

4. In the left sidebar, look for database: **`deshswaar`** (or it might be `test` if it created there)
   - Click to expand it

5. Click on the **`users`** collection

### View Registered Users

6. You should see your registered user(s) displayed in the Documents view

7. **To find a specific user by email:**
   - Click the "Filter" field at the top
   - Enter:
     ```json
     { "email": "john.doe@example.com" }
     ```
   - Click "Find"

8. **View the user document:**
   - You'll see all fields including:
     - `firstName`, `lastName`, `email`, `phone`
     - `password` (hashed with bcrypt - looks like `$2b$12$...`)
     - `dateOfBirth`, `gender`, `maritalStatus`, `aadharNumber`
     - `createdAt`, `updatedAt` timestamps
     - `_id` (MongoDB ObjectId)

### Verify Password is Hashed

9. Click on a user document to expand it
10. Look at the `password` field - it should look like:
    ```
    $2b$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ012345678
    ```
    This confirms passwords are properly hashed with bcrypt!

### Query Other Collections

11. To view applications (if any):
    - Click on the **`applications`** collection
    - Use filter to find by user:
      ```json
      { "user": "USER_ID_HERE" }
      ```

---

## Common Issues & Solutions

### Issue: "User with this email already exists"
**Solution:** Use a different email or delete the existing user in MongoDB Compass

### Issue: "All fields are required"
**Solution:** Make sure you include all required fields:
- firstName, lastName, email, phone
- password, confirmPassword
- dateOfBirth (YYYY-MM-DD format)
- gender (male/female/other)
- maritalStatus (single/married/divorced/widowed)
- aadharNumber (12 digits)

### Issue: "Invalid or expired token"
**Solution:** Login again to get a fresh token (tokens expire after 24 hours)

### Issue: Can't connect to MongoDB in Compass
**Solution:** 
1. Check your internet connection
2. Verify the connection string is correct
3. Ensure your IP is whitelisted in MongoDB Atlas (or allow access from anywhere)

---

## Security Notes

⚠️ **Important:**
- Never commit real credentials to Git
- Use `.env` file for environment variables (already in `.gitignore`)
- Change JWT_SECRET to a strong random string in production
- The default connection string should be stored in `.env`, not in code

---

## Quick Reference: All Required Fields for Registration

```json
{
  "firstName": "string (max 50 chars)",
  "lastName": "string (max 50 chars)",
  "email": "valid email format",
  "phone": "phone number (e.g., +919876543210)",
  "password": "string (min 8 chars)",
  "confirmPassword": "must match password",
  "dateOfBirth": "YYYY-MM-DD format",
  "gender": "male | female | other",
  "maritalStatus": "single | married | divorced | widowed",
  "aadharNumber": "12 digits (e.g., 123456789012)",
  "panNumber": "optional, format: ABCDE1234F"
}
```

---

## Next Steps

Once you've verified signup/login works:
1. Test the change-password endpoint
2. Test application submission endpoints
3. Set up proper environment variables in `.env`
4. Consider adding more test users with different data
