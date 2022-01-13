import React from "react";
import base64 from "base-64"
import axios from "axios"

const authAxios = axios.create({
    baseURL: "http://localhost:8081/auth",
    withCredentials: true
});

function clearToken(){
    return localStorage.removeItem("authToken");
}

function getToken(){
    return localStorage.getItem("authToken");
}

function setToken(token){
    return localStorage.setItem("authToken", token);
}

const AuthContext = React.createContext();

function decode(jwt){
    try{
        if(jwt){
            const plain = base64.decode(jwt.split('.')[1]);
            const obj = JSON.parse(plain);
            return obj;
        } 
    }
    catch(e) {}

    return undefined;
}

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
    }) ;
}

function refreshToken(){
    return new Promise((resolve, reject)=>{
        authAxios.get("/refresh-token")
        .then((res)=>{
            if(res.status == 200){
                setToken(res.data);
                resolve(res.data);
            } 
        })
        .catch(({response})=>{
            reject(null);
        });               
    });
}

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

function expiredTokenIntercept(error){
    return refreshToken()
    .then((token) => {
        error.config.headers.Authorization = `bearer ${token}`;
        return axios.request(error.config);
    })
    .catch((e)=>{
        return Promise.reject(error);
    });
}

export {AuthContext, isAuthenticated, login, logout, register, getToken, expiredTokenIntercept};