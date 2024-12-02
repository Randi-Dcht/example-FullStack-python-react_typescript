import axios from 'axios';
import {
    accountStructure,
    loginStructure,
    orderCommandStructure,
    productStructure,
    registerAdminStructure,
    registerStructure,
    userStructure
} from "./structure.ts";


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


// Login
export async function login(loginData : loginStructure)
{
    return request.post('/login', loginData)
}


// Signup
export async function signup(signUpData : registerStructure)
{
    return request.post('/signup', signUpData)
}


// Account
export async function getAccount()
{
    return request.get('/account')
}
export async function putAccount(accountData: userStructure | accountStructure )
{
    return request.put('/account', accountData)
}
export async function delAccount()
{
    return request.delete('/account')
}
export async function createInternalAccount(accountData: registerAdminStructure )
{
    return request.post('/account', accountData)
}
export async function putActionAccount(action: string, userId: number)
{
    return request.put('/account/' + userId + '/' + action)
}


// Product
export async function getProduct()
{
    return request.get('/product')
}
export async function getProductById(productId: number)
{
    return request.get('/product/' + productId)
}
export async function putProduct(productData: productStructure)
{
    return request.put('/product', productData)
}
export async function delProductById(productId: number)
{
    return request.delete('/product/' + productId)
}
export async function postNewProduct(productData: productStructure)
{
    return request.post('/product', productData)
}


// Command
export async function getCommand()
{
    return request.get('/command')
}
export async function putStatusOfCommand(commandId: number, status: "start_preparation" | "finish_preparation")
{
    return request.put('/command/' + commandId + '/' + status)
}
export async function delCommandById(commandId: number)
{
    return request.delete('/command/' + commandId)
}
export async function postNewCommand(commandData : orderCommandStructure)
{
    return request.post('/command', commandData)
}