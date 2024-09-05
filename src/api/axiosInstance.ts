import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://dgcampus-backend-render.onrender.com/api/',
  // baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('access_token'); // Assuming you're storing the token in localStorage
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
