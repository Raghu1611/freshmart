// API Configuration
const BASE_URL = import.meta.env.VITE_API_URL || 'https://freshmart-bacend.onrender.com';
// Ensure API_URL always ends with /api and remove trailing slashes from base
export const API_URL = BASE_URL.endsWith('/api')
    ? BASE_URL
    : `${BASE_URL.replace(/\/$/, '')}/api`;
