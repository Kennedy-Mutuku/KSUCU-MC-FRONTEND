---
description: Local development setup and authentication workflow
---

# Local Development Setup Workflow

## Prerequisites for Authentication Features

When making changes that involve modules requiring authentication or database access:

### 1. Configure Local MongoDB
Ensure MongoDB is running locally at `mongodb://127.0.0.1:27017/ksucu-mc`

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

### 2. Create Test User Account

**Option A: Create Regular User (for Community Chat, etc.)**
```bash
cd backend
node scripts/createUser.js
```

Default credentials:
- Email: `john.kamau646@students.ksu.ac.ke`
- Password: `user123`

**Option B: Create Admin Account via Admission Admin**
Navigate to the admission admin portal and create an admin account for local testing of admin features.

### 3. Environment Configuration

Ensure `backend/.env` file exists with:
```
DB_CONNECTION_URI=mongodb://127.0.0.1:27017/ksucu-mc
JWT_USER_SECRET=ksucu-mc-user-secret-key-2024-secure-token
JWT_ADMIN_SECRET=ksucu-mc-admin-secret-key-2024-secure-token
SESSION_SECRET=ksucu-mc-session-secret-2024
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Git Workflow

### Before Starting Work
// turbo
```bash
# Always pull the latest changes before starting work
git pull origin main
```

### Before Pushing Changes
// turbo
```bash
# Pull again to ensure you have latest changes
git pull origin main

# Resolve any conflicts if necessary
# Then push your changes
git push origin main
```

## Running the Application Locally

### Start Backend Server
```bash
cd backend
npm run dev:unix
```
Backend runs on: http://localhost:3000

### Start Frontend Server
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

## Testing Authentication Features

1. Start both servers (backend and frontend)
2. Navigate to http://localhost:5173
3. Login with test credentials
4. Test the authentication-dependent features (Community Chat, Admin panels, etc.)

## Important Notes

- **Always test locally** before pushing authentication-related changes
- **Verify database connection** is working
- **Check both frontend and backend logs** for errors
- **Test with real user accounts** created in the local database
- **Remember to pull before push** to avoid merge conflicts
