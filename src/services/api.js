import axios from 'axios'

const api = axios.create({
    baseURL: `http://127.0.0.1:4000/api/`,
    withCredentials : true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        // 'Content-Type' : 'multipart/form-data'
    }
})
    
export default api;
  