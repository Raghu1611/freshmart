# Deploying Docker to the Cloud (Render)

To make your Docker application accessible from anywhere, you need to host it on a cloud server. **Render** is a great free option that supports Docker.

## Step 1: Deploy Backend

1.  Create a new account at [render.com](https://render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Name**: `freshmart-backend`
    *   **Runtime**: **Docker**
    *   **Root Directory**: `backend` (Important!)
    *   **Environment Variables**: Add all variables from your `backend/.env` file (`MONGODB_URI`, `JWT_SECRET`, etc.).
5.  Click **Create Web Service**.
6.  **Copy the URL**: Once deployed, copy the URL (e.g., `https://freshmart-backend.onrender.com`).

## Step 2: Deploy Frontend

1.  Click **New +** and select **Web Service**.
2.  Connect the same GitHub repository.
3.  **Settings**:
    *   **Name**: `freshmart-frontend`
    *   **Runtime**: **Docker**
    *   **Root Directory**: `frontend` (Important!)
    *   **Environment Variables**:
        *   Key: `VITE_API_URL`
        *   Value: Your Backend URL from Step 1 + `/api` (e.g., `https://freshmart-backend.onrender.com/api`)
4.  Click **Create Web Service**.

## Step 3: Final Link

1.  Once the Frontend is deployed, Render will give you a URL (e.g., `https://freshmart-frontend.onrender.com`).
2.  **Update Backend**: Go back to your Backend service settings -> Environment Variables.
3.  Update `FRONTEND_URL` to match your new Frontend URL.
4.  **Redeploy** the Backend.

Now your Docker app is accessible from anywhere in the world!
