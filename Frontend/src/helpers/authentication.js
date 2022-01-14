import React from "react";
import base64 from "base-64"
import axios from "axios";
import {authAxios} from "./axiosInstances.js";

// Authentication status React Context
const AuthContext = React.createContext();

// Clears the Auth Token from the browser local storage
function clearToken(){
    return localStorage.removeItem("authToken");
}

// Gets the Auth Token from the browser local storage
function getToken(){
    return localStorage.getItem("authToken");
}

// Sets the Auth Token in the browser local storage
function setToken(token){
    return localStorage.setItem("authToken", token);
}

// Decodes a JWT to read its contents
// Returns an object parsed from JSON
function decode(jwt){
    try{
        const plain = base64.decode(jwt.split('.')[1]);
        return JSON.parse(plain);
    }
    catch(e) {
        return undefined;
    }
}

// A promise that checks if the user is likely authenticated
// The user is considered authenticated if they have any JWT Auth Token that isn't expired
// By default the function will attempt to refresh an expired Auth Token
// Resolves to true or false
function isAuthenticated(getNewToken = true){
    return new Promise((resolve, reject)=>{
        const jwt = getToken();
        const payload = decode(jwt);
        const nowSeconds = Math.floor(Date.now() / 1000);

        if(payload){
            if((!payload.exp || payload.exp>nowSeconds)){
                resolve(true); 
            }
            else if(getNewToken){
                refreshToken()
                .then(() => resolve(true))
                .catch(() => resolve(false));             
            }
        }
        else {
            resolve(false);
        }
    });
}

// A promise that sends a post request to the auth server to register the user
// On success, resolves to true, on failure, rejects with an error message
function register(usr, pwd){
    return new Promise((resolve, reject)=>{
        authAxios.post("/register", {
            username: usr,
            password: pwd
        })
        .then((res)=>{
            if(res.status == 200){
                resolve(true);
            } 
        })
        .catch(({response})=>{
            reject(response.data);
        });
    });
}

// A promise that sends a post request to the auth server to log in the user
// On success, resolves to true, on failure, rejects with an error message
function login(usr, pwd){
    return new Promise((resolve, reject)=>{
        authAxios.post("/login", {
            username: usr,
            password: pwd
        })
        .then((res)=>{
            if(res.status == 200){
                setToken(res.data);
                resolve(true);
            } 
        })
        .catch(({response})=>{
            reject(response.data);
        })
    });
}

// A promise that sends a post request to the auth server to log out the user
// On success, resolves to true, on failure, rejects with an error message
function logout(){
    return new Promise((resolve, reject)=>{
        authAxios.post("/logout")
        .then((res)=>{
            if(res.status == 200){
                clearToken();
                resolve(true);
            } 
        })
        .catch(({response})=>{
            reject(response.data);
        })
    });
}

// A promise that sends a get request to the auth server to attempt to refresh the expired or missing Auth Token
// of the user in exchange of a Refresh Token that's sent as a cookie. The user also gets a new Refresh Token
// On success, saves the new token and resolves it too, on failure, rejects with an error message
function refreshToken(){
    return new Promise((resolve, reject)=>{
        authAxios.get("/refresh-token")
        .then((res)=>{
            if(res.status == 200){
                setToken(res.data);
                resolve(res.data);
            } 
        })
        .catch((err)=>{
            reject(err);
        });               
    });
}

// Intercepts the rejection of an axios request
// Attempts to refresh the user's Auth Token and retries the request once more 
function expiredTokenIntercept(error){
    return refreshToken()
    .then((token) => {
        error.config.headers.Authorization = `Bearer ${token}`;
        return axios.request(error.config);
    })
    .catch((e)=>{
        return Promise.reject(error);
    });
}

export {AuthContext, isAuthenticated, login, logout, register, getToken, expiredTokenIntercept};