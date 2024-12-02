import axios from 'axios';


const request = axios.create({
    baseURL: `http://localhost:8085/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
});


// Add token to the request
request.interceptors.request.use(
    async config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        Promise.reject(error).then(r => console.log(r));
    });


// when the token is expired, the user is redirected to the login page
request.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if ( error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('type_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);