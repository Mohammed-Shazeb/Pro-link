import axios from "axios";
// import {defualt:axios} = require ("axios");


export const BASE_URL = "http://localhost:9080"

export const clientServer = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {'X-Custom-Header': 'foobar'}
});

// export { clientServer };