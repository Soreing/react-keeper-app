import base64 from "base-64"
import axios from "axios"

const authAxios = axios.create({
    baseURL: "http://localhost:8081/auth",
    withCredentials: true
});

function getToken(){
    return localStorage.getItem("authToken");
}

function setToken(token){
    return localStorage.setItem("authToken", token);
}

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

function isAuthenticated(jwt, getNewToken = true){
    return new Promise((resolve, reject)=>{
        const payload = decode(jwt);
        const nowSeconds = Math.floor(Date.now() / 1000);

        if(payload){
            if((!payload.exp || payload.exp>nowSeconds)){
                resolve(true); 
            }
            else if(getNewToken){
                authAxios.get("/refresh-token").then((res)=>{
                    if(res.status == 200){
                        setToken(res.data);
                        resolve(true);
                    } 
                }).catch(({response})=>{
                    resolve(false);
                })                
            }
        }
        else {
            resolve(false);
        }
    }) ;
}

function login(usr, pwd){
    return new Promise((resolve, reject)=>{
        authAxios.post("/login", {
            username: usr,
            password: pwd
        }).then((res)=>{
            if(res.status == 200){
                setToken(res.data);
                resolve(true);
            } 
        }).catch(({response})=>{
            reject(response.data);
        })
    });
}

export {isAuthenticated, getToken, setToken, login};