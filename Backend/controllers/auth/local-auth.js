import {User} from "../../database.js";
import {makeRefTokenPromise, makeAuthToken} from "../../helpers/common.js";
import {Error, passwordformat, emailformat} from "../../helpers/constants.js";

// Registers a new user in the local database
exports.register = (req, res, next) => {
    if(req.body.username && req.body.password){
        
        const newUser = new User({
            username: req.body.username.trim().toLowerCase(),
            password: req.body.password,
            source:   "local",
        });

        // Test the email and password to ensure they are well formatted
        if(emailformat.test(newUser.username) && passwordformat.test(newUser.password)){
            // Insert the new user to the database
            // If the user already exists, the constraint throws an error
            newUser.save((saveErr)=>{
                if(!saveErr){
                    res.sendStatus(200);
                }
                else{
                    res.status(400).send(Error.alreadyRegistered);
                }
            });
        } 
        else{
            res.status(400).send(Error.invalidFields);
        }
    } 
    else{
        res.status(400).send(Error.missingFields);
    }
}

// Authenticates an existing user from the local database
exports.login = (req, res, next) => {
    if(req.body.username){
        // Find the user and check the validity of the password
        const username = req.body.username.trim().toLowerCase();
        User.findOne({username: username}, (findErr, user)=>{
            if(!findErr){
                if(user && req.body.password === user.password){
                    const data = {id: user._id.toString()};
                    makeRefTokenPromise(data)
                    .then((refToken)=>{
                        const authToken =  makeAuthToken(data);
                        res.cookie("refToken", refToken);
                        res.status(200).send(authToken);
                    });
                } 
                else{
                    res.status(400).send(Error.invalidLogin);
                }
            } 
            else{
                console.log(findErr);
                res.sendStatus(500);
            }
        });
    }
    else{
        res.status(400).send(Error.invalidLogin);
    }
}