import axios from 'axios'
const baseURL = process.env.NODE_ENV === 'production' ? 'https://full-stack-z8dl.onrender.com/api' : 'http://localhost:3000/api'
export default axios.create({
    baseURL,
    headers:{
        'Content-type':'application/json',
    },
    withCredentials: true,
});