import axios from "axios";
import ClientOAuth2 from "client-oauth2";
import {User} from "../../database.js";
import { redirectWithToken, redirectSimple } from "../../helpers/common.js";

const facebookAuth = new ClientOAuth2({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    accessTokenUri: "https://graph.facebook.com/v12.0/oauth/access_token",
    authorizationUri: "https://www.facebook.com/v12.0/dialog/oauth",
    redirectUri: `${process.env.HOSTING_DOMAIN}/auth/facebook/callback`,
    scopes: ["email", "public_profile"]
});

// Redirect the user to the Facebook OAuth2 URL
exports.facebookAuth = (req, res, next) =>{
    const uri = facebookAuth.code.getUri();
    res.redirect(uri);
}

// Callback to the Google OAuth2 request
exports.facebookCallback = (req, res, next) => {
    // Exchanges the access code for a token
    facebookAuth.code.getToken(req.originalUrl)
    .then(function (user) {
        // Requests information about the token (namely the user_id)
        axios.request({
            baseURL: "https://graph.facebook.com",
            url: "/debug_token",
            method: "get",
            params: {
                input_token: user.accessToken,
                access_token: `${process.env.FACEBOOK_CLIENT_ID}|${process.env.FACEBOOK_CLIENT_SECRET}`,
            }
        }) // token.data.data => {user_id}
        .then((token)=>{
            // Requests more information about the user with the user_id
            axios.request({
                baseURL: "https://graph.facebook.com",
                url: `/v12.0/${token.data.data.user_id}/`,
                method: "get",
                headers:{
                    "Authorization": `Bearer ${user.accessToken}`
                }
            }) // details.data => {name, id}
            .then((details)=>{
                const userQuery = {
                    username: `facebook:${details.data.id}`,
                    source: "facebook",
                };
                const options = {
                    upsert: true,
                    returnDocument:"after",
                }
    
                // Find or Insert the user in the database by their username ("facebook:facebookID")
                User.findOneAndUpdate(userQuery, {}, options, (findErr, record)=>{
                    if(!findErr && record){
                        redirectWithToken(res, record._id.toString(), "/notes");
                    }
                    else {
                        console.log(findErr);
                        res.sendStatus(500);
                    }
                });
            })
            .catch((err)=>{
                console.log(err);
                res.sendStatus(500);
            });
        })
        .catch((err)=>{
            console.log(err);
            res.sendStatus(500);
        });
    })
    // The user likely rejected the 3rd Party authentication
    .catch((err)=>{
        redirectSimple("/login");
    })
}