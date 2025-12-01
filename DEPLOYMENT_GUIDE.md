# Deployment Guide for Vercel

This project consists of two parts: `backend` (Node.js/Express) and `frontend` (React/Vite). They should be deployed as two separate projects on Vercel.

## 1. Deploying the Backend

1.  **Push to GitHub**: Ensure your latest code is pushed to GitHub.
2.  **Import Project**: Go to Vercel Dashboard -> Add New -> Project -> Import your repository.
3.  **Configure Project**:
    *   **Root Directory**: Select `backend` (click "Edit" next to Root Directory).
    *   **Framework Preset**: Select "Other" (or it might detect Express/Node).
    *   **Environment Variables**: Add the following variables from your `.env` file:
        *   `MONGODB_URI`
        *   `JWT_SECRET`
        *   `EMAIL_API_URL`
        *   `VERIFY_API_KEY`
        *   `FRONTEND_URL` (Set this to your *future* frontend URL, e.g., `https://your-frontend-app.vercel.app`)
4.  **Deploy**: Click "Deploy".
5.  **Get URL**: Once deployed, copy the domain (e.g., `https://your-backend-app.vercel.app`).

## 2. Deploying the Frontend

1.  **Import Project**: Go to Vercel Dashboard -> Add New -> Project -> Import your repository (again).
2.  **Configure Project**:
    *   **Root Directory**: Select `frontend` (click "Edit" next to Root Directory).
    *   **Framework Preset**: It should automatically detect "Vite".
    *   **Environment Variables**: Add the following:
        *   `VITE_API_URL`: Set this to your **Backend URL** + `/api` (e.g., `https://your-backend-app.vercel.app/api`).
3.  **Deploy**: Click "Deploy".

## 3. Final Configuration

1.  **Update Backend**: Go back to your **Backend** project on Vercel -> Settings -> Environment Variables.
2.  **Update FRONTEND_URL**: Ensure `FRONTEND_URL` matches your actual deployed **Frontend URL**.
3.  **Redeploy Backend**: Go to Deployments -> Redeploy (to apply the new environment variable).

## Troubleshooting

*   **CORS Issues**: If you see CORS errors, ensure your backend `cors` configuration allows the frontend domain. You might need to update `backend/server.js` to explicitly allow the frontend origin if `cors()` default isn't enough (default `cors()` allows all, which is fine for testing but check if you restricted it).
*   **404 on Refresh**: If refreshing a page on the frontend gives a 404, ensure `frontend/vercel.json` exists with the rewrite rule (I have already created this for you).
