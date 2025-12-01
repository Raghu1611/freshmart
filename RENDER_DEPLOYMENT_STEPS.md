# 🚀 Render Backend Deployment - Step by Step

## ✅ Changes Made
- ✅ Removed `backend/vercel.json` (not needed for Render)
- ✅ Removed `backend/api/` folder (Vercel-specific)
- ✅ Fixed CORS configuration in `server.js`
- ✅ Pushed changes to GitHub

---

## 📋 Render Deployment Steps

### Step 1: Go to Render Dashboard
1. Visit [https://dashboard.render.com/](https://dashboard.render.com/)
2. Sign in with your GitHub account

### Step 2: Create New Web Service
1. Click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub repository: `Raghu1611/freshmart`
4. Click **"Connect"**

### Step 3: Configure Service Settings

**Basic Settings:**
- **Name**: `freshmart-backend` (or any name you prefer)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (or paid if you prefer)

### Step 4: Add Environment Variables

Click **"Advanced"** and add these environment variables:

```
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRE=7d
EMAIL_SERVICE_API=<your_email_api>
EMAIL_API_KEY=<your_email_key>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_cloudinary_key>
CLOUDINARY_API_SECRET=<your_cloudinary_secret>
RAZORPAY_KEY_ID=<your_razorpay_key>
RAZORPAY_KEY_SECRET=<your_razorpay_secret>
NODE_ENV=production
FRONTEND_URL=https://freshmart-b5uz.vercel.app
PORT=5000
```

**Important Notes:**
- Replace all `<your_...>` values with your actual credentials
- Copy these from your `backend/.env` file
- Make sure `FRONTEND_URL` matches your Vercel deployment URL

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (usually 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://freshmart-backend.onrender.com`

### Step 6: Test Backend
Open these URLs in your browser:

1. **Root**: `https://your-backend.onrender.com/`
   - Should show: "API is running..."

2. **Health Check**: `https://your-backend.onrender.com/api/health`
   - Should show: `{"status":"OK","message":"Server is running"}`

---

## 🔧 Update Vercel Frontend

After backend is deployed, update your Vercel environment variable:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project
3. Go to **Settings** → **Environment Variables**
4. Update or add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com/api`
5. **Redeploy** your frontend

---

## 🔍 Verify CORS is Working

After both deployments:

1. Open your Vercel frontend: `https://freshmart-b5uz.vercel.app`
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Try to login/register
5. Check **Network** tab - you should see:
   - Status: `200 OK` (not CORS error)
   - Response headers should include: `Access-Control-Allow-Origin`

---

## ⚠️ Troubleshooting

### CORS Error Still Showing?

**Check 1: Verify Render Deployment**
- Go to Render dashboard
- Check deployment logs
- Ensure latest commit is deployed

**Check 2: Verify Environment Variables**
- In Render dashboard, check all env vars are set
- Especially check `FRONTEND_URL` is correct

**Check 3: Force Redeploy**
- In Render dashboard
- Click **"Manual Deploy"** → **"Clear build cache & deploy"**

**Check 4: Check server.js**
- Ensure CORS configuration includes your Vercel URL
- Current config allows: `https://freshmart-b5uz.vercel.app`

### MongoDB Connection Error?

**Check:**
- MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- `MONGODB_URI` in Render env vars is correct
- Database user has read/write permissions

### Backend Not Starting?

**Check Render Logs:**
1. Go to Render dashboard
2. Click on your service
3. Go to **"Logs"** tab
4. Look for error messages

---

## 📊 Current Configuration

**Backend (Render):**
- Repository: `https://github.com/Raghu1611/freshmart`
- Root Directory: `backend`
- Start Command: `npm start`
- Entry Point: `server.js`

**Frontend (Vercel):**
- Repository: `https://github.com/Raghu1611/freshmart`
- Root Directory: `frontend`
- Framework: Vite
- Environment: `VITE_API_URL` → Render backend URL

**CORS Allowed Origins:**
- `http://localhost:5173` (local dev)
- `http://localhost:3000` (local dev)
- `https://freshmart-b5uz.vercel.app` (production)
- Any URL in `FRONTEND_URL` env var

---

## 🎯 Next Steps

1. ✅ Backend code updated and pushed to GitHub
2. ⏳ Wait for Render to auto-deploy (or manually deploy)
3. ⏳ Update Vercel `VITE_API_URL` environment variable
4. ⏳ Redeploy Vercel frontend
5. ✅ Test your application!

---

**Status**: Code ready for deployment
**Last Updated**: 2025-12-01
