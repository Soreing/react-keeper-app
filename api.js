import express from "express";
import bodyparser from "body-parser";
import cookieparser from "cookie-parser";
import jwt from "jsonwebtoken"
import cors from "cors";

const secret = "Test";

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
    const refToken  = jwt.sign({
        ...data,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60,//7200,
    }, secret);
    
    const authToken = jwt.sign({
        ...data,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 10,//120,
    }, secret);

    res.cookie("refToken", refToken);
    res.status(200).send(authToken);
}

app.post("/auth/login", (req,res)=>{
    console.log("Hebo");
    if(req.body.username){
        sendToken(res, {username: req.body.username});
    }
    else {
        res.status(400).send("Invalid Username or Password");
    }
})

app.get("/auth/refresh-token", (req,res)=>{
    if(req.cookies.refToken){
        jwt.verify(req.cookies.refToken, secret, (err, decoded)=>{
            if(!err && decoded){
                sendToken(res, {username: decoded.username});
            }
            else {
                res.sendStatus(400);
            }
        })
    }
})

app.post("/api/notes", (req,res)=>{

})