# Authentication System with Email Verification

A complete authentication system built with React (Vite), Node.js, Express, MongoDB, and Tailwind CSS.

## Features

✅ **Email-based Registration** - Users register with email and receive a verification link
✅ **Email Verification** - Users must verify their email before setting a password
✅ **Secure Login** - JWT-based authentication
✅ **Forgot Password** - OTP-based password reset via email
✅ **Beautiful UI** - Modern, responsive design with Tailwind CSS
✅ **Protected Routes** - Dashboard accessible only to authenticated users

## Setup Instructions

### 1. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (or use existing one)
3. Click "Connect" → "Connect your application"
4. Copy your connection string
5. Update `backend/.env` with your MongoDB URI

### 2. Update Environment Variables

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/auth-system?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key_here_make_it_long
VERIFY_API_KEY=vedjsjssdjkjjnsddjsksdbssdflsfmbjm
EMAIL_API_URL=https://mailservice-nine.vercel.app/api/send
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

Dependencies are being installed automatically. Wait for the installation to complete.

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
./start-backend.bat
```

**Terminal 2 - Frontend:**
```bash
./start-frontend.bat
```

## User Flow

### Registration Flow
1. User enters email on `/register`
2. System sends verification email with a link
3. User clicks the link (opens `/verify-email?token=...`)
4. User sets their password
5. User is automatically logged in and redirected to dashboard

### Login Flow
1. User enters email and password on `/login`
2. System validates credentials
3. User is redirected to dashboard

### Forgot Password Flow
1. User clicks "Forgot Password" on login page
2. User enters email
3. System sends 6-digit OTP via email
4. User enters OTP and new password
5. Password is reset, user can login with new password

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Send verification email |
| POST | `/api/auth/verify-email` | Verify email and set password |
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/forgot-password` | Send password reset OTP |
| POST | `/api/auth/reset-password` | Reset password with OTP |

## Tech Stack

**Frontend:**
- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS

**Backend:**
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Axios for email service integration

## Email Service

The application uses a custom email API endpoint for sending emails:
- Verification emails during registration
- OTP emails for password reset

Endpoint: `https://mailservice-nine.vercel.app/api/send`

## Security Features

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens for secure authentication
- Email verification required before account activation
- Time-limited verification tokens (30 minutes)
- Time-limited OTP for password reset (15 minutes)
- Protected routes with authentication middleware

## Project Structure

```
login/
├── backend/
│   ├── controllers/
│   │   └── authController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── utils/
│   │   └── email.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── src/
│   ├── pages/
│   │   ├── Register.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   └── config.js
├── index.html
├── package.json
├── tailwind.config.js
├── start-backend.bat
└── start-frontend.bat
```

## Development

Frontend runs on: `http://localhost:5173`
Backend runs on: `http://localhost:5000`

## Notes

- Make sure MongoDB Atlas allows connections from your IP address
- Check spam folder if verification emails don't arrive
- Verification token expires in 30 minutes
- Password reset OTP expires in 15 minutes
