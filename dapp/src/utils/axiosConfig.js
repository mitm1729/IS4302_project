// utils/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', // Fallback to localhost:5000 in development
});

export default axiosInstance;