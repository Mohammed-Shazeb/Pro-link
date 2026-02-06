import axios from "axios";
// import {defualt:axios} = require ("axios");


export const BASE_URL = "https://pro-link-1.onrender.com/"

export const clientServer = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {'X-Custom-Header': 'foobar'}
});

// export { clientServer };