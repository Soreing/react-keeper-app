import mongoose from "mongoose";
import {dbPort, dbName, dbUser} from "./helpers/constants.js";


mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`, process.env.DBAUTH !== "disabled" ? dbUser : {});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    verified: Boolean,
    verCode:  String,
    source: String,
    notes: Array,
});

const tokenSchema = new mongoose.Schema({
    token: String,
    exp: Number,
});

const User = mongoose.model("User", userSchema);
const Token = mongoose.model("Token", tokenSchema);
const ObjectId = mongoose.Types.ObjectId;

setInterval(()=>{
    const now = Math.floor(Date.now() / 1000);
    Token.deleteMany({ exp: {$lt: now}}, (err, res)=>{} );
}, 60000);

export {User, Token, ObjectId};