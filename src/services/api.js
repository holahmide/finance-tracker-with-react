import axios from 'axios'

const api = axios.create({
    baseURL: `${process.env.BACKEND_URL}`,
    withCredentials : true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})
    
export default api;
  