import axios from "axios";
import {expiredTokenIntercept} from "./authentication.js";
import {authServerDomain, apiServerDomain} from "./constants.js";

// Authentication Axios instance configured to target the api's URL and port
const apiAxios = axios.create({
    baseURL: `${apiServerDomain}`,
    withCredentials: true
});

// Authentication Axios instance configured to target the api's URL and port and /auth route
const authAxios = axios.create({
    baseURL: `${authServerDomain}/auth`,
    withCredentials: true
});

// Interceptor to retry requests on "apiAxios"
apiAxios.interceptors.response.use(null, expiredTokenIntercept)

export {authAxios, apiAxios}