import crypto from "crypto";
import axios from "axios";
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

// Creates a Refresh Token and redirects the request to a page on the webserver
function redirectWithToken(res, data, route){
    makeRefTokenPromise(data)
    .then((token)=>{
        res.cookie("refToken", token)
        res.redirect(`${process.env.HOSTING_DOMAIN}${route}`);
    });
}

// Simply redirects the request to a page on the webserver
function redirectSimple(res, route){
    res.redirect(`${process.env.HOSTING_DOMAIN}${route}`);
}

// Generates a 32 character long code from 24 bytes of random data
function makeRandomCode(){
    const bytes = crypto.randomBytes(24);
    const str   = bytes.toString("base64");
    const code  = str.replaceAll('/', '-')
    return code;
}


function verifyEmailAPI(address){
    if(process.env.VERIFY_EMAIL_API !== "disabled"){
        return new Promise((resolve, reject)=>{
            axios({
                method: "get",
                url: " https://emailverification.whoisxmlapi.com/api/v2",
                params: {
                    apiKey: process.env.WHOISXML_APIKEY,
                    emailAddress: address,
                }
            })
            .then((response)=>{
                const details = response.data;
                if(details){
                    resolve(details.formatCheck == "true"
                        && details.smtpCheck == "true" 
                        && details.dnsCheck == "true"
                    );
                }
            })
            .catch((err)=>{
                reject(err);
            })
        })
    }
    else {
        return new Promise((resolve, reject)=>{resolve(true)});
    }
}

export {verifyJWTPromise, makeRefTokenPromise, makeAuthToken, redirectWithToken, redirectSimple, makeRandomCode, verifyEmailAPI}