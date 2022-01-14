import {verifyJWTPromise} from "../helpers/common.js";
import {tokenSecret} from "../helpers/constants.js";

// Verifies the signature of a JWT Auth Token
const verifyAuthToken = (req, res, next) => {
    const header = req.headers.authorization;
    if(header){
        const [type, token] = header.split(" ");
        if(type === "Bearer" && token){
            verifyJWTPromise(token, tokenSecret)
            .then((decoded) =>{
                req.user = decoded;
                next();
            })
            .catch((err)=>{
                res.sendStatus(401);
            });
        }
        else { 
            res.sendStatus(401);
        }
    }
    else {
        res.sendStatus(401);
    }
}

export {verifyAuthToken}