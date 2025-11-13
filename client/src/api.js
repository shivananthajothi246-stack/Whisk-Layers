import axios from 'axios';

/*
  Centralized axios instance.
  - Uses REACT_APP_API_BASE_URL if provided (good for production).
  - Falls back to '/api' to let CRA's proxy (in development) forward requests to the server.
*/
const baseURL = process.env.REACT_APP_API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;