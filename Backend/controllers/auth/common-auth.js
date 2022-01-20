import {Token} from "../../database.js";
import {verifyJWTPromise, makeRefTokenPromise, makeAuthToken} from "../../helpers/common.js";
import {tokenSecret, cookieOptions} from "../../helpers/constants.js";

// Logs the user out of the system
// If the request has a refresh token, try to delete it from the database
exports.logout = (req, res, next) => {
    if(req.cookies.refToken){ 
        Token.deleteOne({token: req.cookies.refToken}, (delErr) => {
            if(!delErr){
                res.clearCookie("refToken");
                res.sendStatus(200);
            } 
            else {
                console.log(delErr);
                res.sendStatus(500);
            }
        });
    } 
    else {
        res.sendStatus(200);
    }
}

// Refreshes the authentication token of the user
exports.refreshAuthToken = (req, res, next) => {
    if(req.cookies.refToken){
        const findTokenPr = Token.findOne({token:req.cookies.refToken});
        const verifyPr    = verifyJWTPromise(req.cookies.refToken, tokenSecret);

        // If the token exists in the database AND it's valid
        Promise.all([verifyPr, findTokenPr])
        .then( ([decoded, token]) => {
            // Delete the old token and refrensh the user's ref and auth tokens
            Token.deleteOne(token, (delErr) => {
                if(!delErr){
                    const data = {
                        id: decoded.id,
                        name: decoded.name,
                    };
                    
                    makeRefTokenPromise(data)
                    .then((refToken)=>{
                        const authToken =  makeAuthToken(data);
                        res.cookie("refToken", refToken, cookieOptions);
                        res.status(200).send(authToken);
                    });
                }
                else {
                    console.log(delErr);
                    res.sendStatus(500);
                }
            });
        })
        // Else remove the invalid token cookie from the response
        .catch((err)=>{
            res.clearCookie("refToken");
            res.sendStatus(400);
        });
    }
    else {
        res.sendStatus(400);
    }
}