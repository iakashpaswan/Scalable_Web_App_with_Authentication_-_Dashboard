import axios from 'axios';

// 1. Axios का instance बनाएं
const api = axios.create({
  // अपने Backend का URL यहाँ डालें
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor जोड़ें: हर Request के साथ Token भेजने के लिए
api.interceptors.request.use(
  (config) => {
    // LocalStorage से टोकन निकालें
    const token = localStorage.getItem('token');
    
    if (token) {
      // अगर टोकन है, तो उसे Authorization Header में लगा दें
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: अगर Token एक्सपायर हो जाए तो हैंडल करने के लिए
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // अगर 401 Unauthorized एरर आए, तो यूजर को लॉगिन पेज पर भेज दें
      console.error("Token expired or invalid. Logging out...");
      localStorage.removeItem('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

import api from '../lib/api';

const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks'); // सिर्फ एंडपॉइंट लिखें
    console.log(response.data);
  } catch (err) {
    console.error("Error fetching tasks");
  }
};