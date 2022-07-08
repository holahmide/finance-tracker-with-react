import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://127.0.0.1:4000/api/',
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default api;
