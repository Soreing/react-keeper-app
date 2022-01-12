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

function verifyToken(req, res, next){
    const header = req.headers.authorization;
    
    if(header){
        const [type, token] = header.split(" ");
        if(type.toLowerCase() == "bearer" && token){
            jwt.verify(token, secret, (err, decoded) => {
                if(!err && decoded){
                    req.user = decoded;
                    next();
                } 
                else { res.sendStatus(400); }
            })
        }
        else { res.sendStatus(401);}
    }
    else { res.sendStatus(402);}
}

app.post("/auth/register", (req,res)=>{
    if(req.body.username && req.body.password){
        const processedEmail = req.body.username.trim().toLowerCase();
        const emailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const passwordformat = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\$%@\^&;\!\?\.\+\-\*\=_]).{8,32}$/;

        if(emailformat.test(processedEmail) && passwordformat.test(req.body.password)){
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
                console.log(user);
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
});

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
});

app.get("/notes", verifyToken, (req,res)=>{
    User.findOne({_id: req.user.id}, (err, user)=>{
        if(!err && user){
            const notes = user.notes.map(e => {return {id:e._id.toString(), title:e.title, content:e.content}} );
            res.json(notes);
        } else {
            res.status(400).send(err);
        }
    });
});

app.get("/notes/:noteid", verifyToken, (req,res)=>{
    User.findOne({_id: req.user.id}, (err, user)=>{
        if(user){
            const notes = user.notes.map(e => {return {id:e._id.toString(), title:e.title, content:e.content}} );
            const note = notes.find(e => e.id == req.params.noteid);

            if(note){
                res.json(note);
            } else {
                res.status(400).send(err);
            }
        }
    });
});

app.post("/notes", verifyToken, (req,res)=>{

    const newNote = {
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content
    };

    User.updateOne( {id: req.user.id}, {$push: {notes: newNote}}, (err, done)=>{
        if(!err){
            res.sendStatus(200);
        } else {
            res.status(400).send(err);
        }
    });
});

app.delete("/notes", verifyToken, (req,res)=>{

    User.updateOne( {id: req.user.id}, {notes: []}, (err, done)=>{
        if(!err){
            res.sendStatus(200);
        } else {
            res.status(400).send(err);
        }
    });
});

app.delete("/notes/:noteid", verifyToken, (req,res)=>{

    const selector = {
        _id: new mongoose.Types.ObjectId(req.params.noteid),
    }; 

    User.updateOne( {id: req.user.id}, {$pull: {notes: selector}}, (err, done)=>{
        if(!err){
            res.sendStatus(200);
        } else {
            res.status(400).send(err);
        }
    });
});