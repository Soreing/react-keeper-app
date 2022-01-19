import axios from "axios";
import ClientOAuth2 from "client-oauth2";
import {User} from "../../database.js";
import { redirectWithToken, redirectSimple } from "../../helpers/common.js";

const googleAuth = new ClientOAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    accessTokenUri: "https://oauth2.googleapis.com/token",
    authorizationUri: "https://accounts.google.com/o/oauth2/v2/auth",
    redirectUri: `${process.env.HOSTING_DOMAIN}auth/google/callback`,
    scopes: ["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
});

// Redirect the user to the Google OAuth2 URL
exports.googleAuth = (req, res, next) =>{
    const uri = googleAuth.code.getUri();
    res.redirect(uri);
}

// Callback to the Google OAuth2 request
exports.googleCallback = (req, res, next) => {
    // Exchanges the access code for a token
    googleAuth.code.getToken(req.originalUrl)
    .then(function (user) {
        
        //requests more information about the user
        axios.request({
            baseURL: "https://www.googleapis.com",
            url: "/userinfo/v2/me",
            method: "get",
            headers:{
                "Authorization": `Bearer ${user.accessToken}`
            }
        }) // details.data => {id, email, name, picture}
        .then((details)=>{
            const userQuery = {
                username: `google:${details.data.id}`,
                source: "google",
            };
            const options = {
                upsert: true,
                returnDocument:"after",
            }

            // Find or Insert the user in the database by their username ("google:googleID")
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
    // The user likely rejected the 3rd Party authentication
    .catch((err)=>{
        redirectSimple(res, "/login");
    })
}