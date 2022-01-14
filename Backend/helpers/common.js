import jwt from "jsonwebtoken";
import {Token} from "../database.js";
import {tokenSecret, refTokenTTL, authTokenTTL} from "./constants.js";

// Creates a promise that will verify the validity of a JWT token
// Resolves the decoded token or rejects with an error
const verifyJWTPromise = (token, secret) => {
    return new Promise( (resolve, reject)=>{
        try { 
            resolve(jwt.verify(token, secret)); 
        } 
        catch(err) {
            reject(err); 
        }
    });
}

// Creates a promise that will create a Refresh Token
// Resolves the new token as a string or rejects with an error
function makeRefTokenPromise(data){
    return new Promise((resolve,reject)=>{
        const now = Math.floor(Date.now() / 1000);
        const refToken  = jwt.sign({
            ...data,
            iat: now,
            exp: now + refTokenTTL
        }, tokenSecret);
    
        const newToken = new Token({
            token: refToken, 
            exp: now + refTokenTTL 
        });
        
        newToken.save((err)=>{
            if(!err){
                resolve(refToken);
            } else {
                reject(err);
            }
        });
    });
}

// Createst a new signed Auth Token and returns it
function makeAuthToken(data){
    const now = Math.floor(Date.now() / 1000);
    return jwt.sign({
        ...data,
        iat: now,
        exp: now + authTokenTTL
    }, tokenSecret);
}

// Creates a Refresh Token and redirects the request back to the app
function redirectWithToken(res, id){
    makeRefTokenPromise({id: id})
    .then((token)=>{
        res.cookie("refToken", token)
        res.redirect("http://localhost:8080/notes");
    });
}


export {verifyJWTPromise, makeRefTokenPromise, makeAuthToken, redirectWithToken}