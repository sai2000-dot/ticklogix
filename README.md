# TickLogix ERP

Internal ERP system for Valarcorp Inc. Built with React, Node.js, and MongoDB.

## Prerequisites

Make sure you have these installed before running the project:

| Tool | Minimum Version | Download |
|------|----------------|---------|
| Node.js | v20.0.0 | https://nodejs.org |
| npm | v9.0.0 | Comes with Node.js |
| Git | Any | https://git-scm.com |

## Project Structure
```
ticklogix/
├── frontend/    ← React application (port 3000)
└── backend/     ← Node.js + Express API (port 5000)
```

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ticklogix
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=8h
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

You should see:
```
[Server] Running on http://localhost:5000
[MongoDB] Connected: ...
```

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

App opens at http://localhost:3000

## Creating Your First Users

Open browser at http://localhost:3000, press F12, go to Console and run:

**Admin user:**
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    email: 'admin@ticklogix.com',
    password: 'admin123',
    role: 'admin'
  })
}).then(r => r.json()).then(console.log)
```

**Manager user:**
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Manager',
    username: 'manager',
    email: 'manager@ticklogix.com',
    password: 'manager123',
    role: 'manager'
  })
}).then(r => r.json()).then(console.log)
```

**Employee user:**
```javascript
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Jane',
    lastName: 'Employee',
    username: 'employee',
    email: 'employee@ticklogix.com',
    password: 'employee123',
    role: 'employee'
  })
}).then(r => r.json()).then(console.log)
```

## User Roles

| Role | Permissions |
|------|------------|
| employee | Create timesheets, submit own timesheets, view invoices |
| manager | Everything employee can do + approve/reject timesheets + create invoices |
| admin | Full access to everything |

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Create account |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Auth | Get current user |
| GET | /api/timesheets | Auth | List timesheets |
| POST | /api/timesheets | Auth | Create timesheet |
| PATCH | /api/timesheets/:id/submit | Auth | Submit timesheet |
| PATCH | /api/timesheets/:id/approve | Manager/Admin | Approve timesheet |
| PATCH | /api/timesheets/:id/reject | Manager/Admin | Reject timesheet |
| GET | /api/invoices | Auth | List invoices |
| GET | /api/invoices/:id | Auth | Invoice detail |
| POST | /api/invoices | Manager/Admin | Create invoice |
| PATCH | /api/invoices/:id/status | Manager/Admin | Update status |

## Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router v6
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Auth:** JWT tokens
```

Save it. Now we need a `.gitignore` file. Create `.gitignore` in the root `ticklogix` folder:
```
# Dependencies
node_modules/

# Environment variables - NEVER commit these
.env
.env.local

# Build output
/frontend/build

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db