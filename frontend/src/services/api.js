import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  timeout: 10000,
});

export const numericalMethodsApi = {
  taylor: (payload) => api.post('/taylor', payload),
  biseccion: (payload) => api.post('/biseccion', payload),
  newton: (payload) => api.post('/newton', payload),
  sistemas: (payload) => api.post('/sistemas', payload),
  lagrange: (payload) => api.post('/lagrange', payload),
  newtonInterpolacion: (payload) => api.post('/newton-interpolacion', payload),
  conversion: (payload) => api.post('/conversion', payload),
};

export default api;
