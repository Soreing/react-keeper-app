import express from "express";
import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import cors from "cors";

const dbPort = 27017;
const dbName = "keeperAppDB";
const secret = "Test";

// Mongoose Configs
mongoose.connect(`mongodb://localhost:${dbPort}/${dbName}`);

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    notes: Array,
});

const tokenSchema = new mongoose.Schema({
    token: String,
    exp: Number,
});

const User = mongoose.model("User", userSchema);
const Token = mongoose.model("Token", tokenSchema);

setInterval(()=>{
    const now = Math.floor(Date.now() / 1000);
    Token.deleteMany({ exp: {$lt: now}}, (err, res)=>{} );
}, 60000);

// Express Configs 
const app = express();

const corsOptions = {
    origin: "http://localhost:8080",
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(bodyparser.raw());
app.use(cookieparser());
app.use(cors(corsOptions));
app.listen(8081);

function sendToken(res, data){
    const now = Math.floor(Date.now() / 1000);
    
    const refToken  = jwt.sign({
        ...data,
        iat: now,
        exp: now + 60,//7200,
    }, secret);
    
    const authToken = jwt.sign({
        ...data,
        iat: now,
        exp: now + 10,//120,
    }, secret);

    const newToken = new Token({token: refToken, exp: now+60 });
    
    newToken.save((err)=>{
        if(!err){
            res.cookie("refToken", refToken);
            res.status(200).send(authToken);
        }
    })
}

app.post("/auth/register", (req,res)=>{
    if(req.body.username && req.body.password){
        const processedEmail = req.body.username.trim().toLowerCase();
        const emailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if(emailformat.test(processedEmail)){
            User.findOne({username: processedEmail}, (err, user)=>{
                if (user){
                    res.status(400).send("This email is already registered");
                }
                else if (!err) {
                    const newUser = new User({
                        username: req.body.username,
                        password: req.body.password,
                    })

                    newUser.save((err)=>{
                        if(!err){
                            res.sendStatus(200);
                        }
                    })
                }
            })
        }
        else{
            res.status(400).send("Invalid input details");
        }
    }
    else {
        res.status(400).send("Missing input details");
    }
})

app.post("/auth/login", (req,res)=>{
    
    if(req.body.username){
        User.findOne({username: req.body.username}, (err, user)=>{
            if(user && req.body.password === user.password){
                sendToken(res, {username: req.body.username});
            }
            else {
                res.status(400).send("Invalid Username or Password");
            }
        });
    }
    else {
        res.status(400).send("Invalid Username or Password");
    }
})

app.get("/auth/refresh-token", (req,res)=>{
    if(req.cookies.refToken){
        
        const findTokenPr = Token.findOne({token:req.cookies.refToken});
        const verifyPr    = new Promise( (resolve, reject)=>{
            try{ resolve(jwt.verify(req.cookies.refToken, secret)); }
            catch(err) {reject(err); }
        });

        Promise.all([verifyPr, findTokenPr])
        .then( ([decoded, token]) => {
            Token.deleteOne(token, (err) => {
                sendToken(res, {username: decoded.username});
            })
        })
        .catch((err)=>{
            res.clearCookie("refToken");
            res.sendStatus(400);
        });
    }
    else {
        res.sendStatus(400);
    }
})

app.post("/api/notes", (req,res)=>{

})