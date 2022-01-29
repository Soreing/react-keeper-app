import axios from "axios";
import ClientOAuth2 from "client-oauth2";
import {User} from "../../database.js";
import { redirectWithToken, redirectSimple } from "../../helpers/common.js";

const discordAuth = new ClientOAuth2({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    accessTokenUri: "https://discord.com/api/oauth2/token",
    authorizationUri: "https://discord.com/api/oauth2/authorize",
    redirectUri: `${process.env.AUTH_SERVER}/auth/discord/callback`,
    scopes: ["identify", "email"]
});

// Redirect the user to the Discord OAuth2 URL
exports.discordAuth = (req, res, next) =>{
    const uri = discordAuth.code.getUri();
    res.redirect(uri);
}

// Callback to the Discord OAuth2 request
exports.discordCallback = (req, res, next) => {
    // Exchanges the access code for a token
    discordAuth.code.getToken(req.originalUrl)
    .then(function (user) {
        
        //requests more information about the user
        axios.request({
            baseURL: "https://discord.com/api",
            url:"/users/@me",
            method: "get",
            headers:{
                "Authorization": `Bearer ${user.accessToken}`
            }
        }) // details.data => {id, email, username, discriminator, avatar(code)}
        .then((details)=>{
            const userQuery = {
                username: `discord:${details.data.id}`,
                source: "discord",
            };
            const options = {
                upsert: true,
                returnDocument:"after",
            }

            // Find or Insert the user in the database by their username ("discord:discordID")
            User.findOneAndUpdate(userQuery, {}, options, (findErr, record)=>{
                if(!findErr && record){
                    const data = {
                        id: record._id.toString(),
                        name: `${details.data.username}#${details.data.discriminator}`,
                    }
                    
                    redirectWithToken(res, data, "/notes");
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