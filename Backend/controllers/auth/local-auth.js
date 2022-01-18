import bcrypt from "bcrypt";
import {User} from "../../database.js";
import {makeRefTokenPromise, makeAuthToken, makeRandomCode, verifyEmailAPI, redirectWithToken} from "../../helpers/common.js";
import {confirmEmailTemplate} from "../../helpers/templates.js";
import {Error, passwordformat, emailformat} from "../../helpers/constants.js";
import {transporter} from "../../helpers/mailserver.js";

// Registers a new user in the local database
exports.register = (req, res, next) => {
    if(req.body.username && req.body.password){
        // Hash the user's password
        bcrypt.hash(req.body.password, 10, function(err, passwordHash) {
            const newUser = {
                username: req.body.username.trim().toLowerCase(),
                password: passwordHash,
                source:   "local",
                verCode:  makeRandomCode(),
                verified: false,
            };
            const selector = {
                username: newUser.username, 
                verified: false,
            };
            const options = {
                rawResult: true,
                upsert: true,
                returnDocument: "after",
            };

            // Test the email and password to ensure they are well formatted
            if(emailformat.test(newUser.username) && passwordformat.test(req.body.password)){
                // Check if the address is valid and can accept emails
                verifyEmailAPI(newUser.username)
                .then((valid)=>{
                    if(valid){
                        // Update or insert a new user with a verification code
                        // If a verified user already exists, the unique constraint throws an error
                        User.findOneAndReplace(selector, newUser, options, (updateErr, record)=>{
                            if(!updateErr){
                                transporter.sendMail({
                                    from: "info@soreing.site",
                                    to:   newUser.username,
                                    subject: "Notes App Account Verification",
                                    text: "[TO BE FILLED IN]",
                                    html: confirmEmailTemplate(`https://api-notes.soreing.site/auth/verify/${newUser.verCode}`),
                                }, (emailErr, info)=>{
                                    if(!emailErr){
                                        res.sendStatus(200);
                                    } 
                                    else {
                                        console.log(emailErr);
                                        res.sendStatus(500);
                                    }
                                });
                            }
                            else{
                                res.status(400).send(Error.alreadyRegistered);
                            }
                        });
                    }
                    else {
                        res.status(400).send(Error.emailNotValid);
                    }
                })
                .catch((err)=>{
                    console.log(err);
                    res.sendStatus(500);
                });
            } 
            else{
                res.status(400).send(Error.invalidFields);
            }
        });
    } 
    else{
        res.status(400).send(Error.missingFields);
    }
}

// Verify the registration of a user in the local database
exports.verify = (req, res, next) => {
    if(req.params.verCode){
        const selector = {
            verCode:  req.params.verCode,
            verified: false,
        };
        const change = {
            verCode:  "",
            verified: true,
        };
        
        // Update the verification status of the user if a token matches
        // If verification is successful, the user is redirected to the notes page
        User.findOneAndUpdate(selector, change, (updateErr, record)=>{
            if(!updateErr){
                if(record){
                    redirectWithToken(res, record._id.toString());
                }
                else {
                    res.redirect("http://localhost:8080/bad-token");
                }
            }
            else{
                console.log(updateErr);
                res.sendStatus(500);
            }
        });
    }
}

// Authenticates an existing user from the local database
exports.login = (req, res, next) => {
    if(req.body.username && req.body.password){
        // Find the user and check the validity of the password
        const username = req.body.username.trim().toLowerCase();
        User.findOne({username: username}, (findErr, user)=>{
            if(!findErr){
                if(user){
                    // Get the hash match of the password
                    bcrypt.compare(req.body.password, user.password, function(err, passwordMatch) {
                        if(!user.verified){
                            res.status(400).send(Error.userNotVerified);
                        }
                        else if(!passwordMatch){
                            res.status(400).send(Error.invalidLogin);
                        }
                        else{
                            const data = {id: user._id.toString()};
                            makeRefTokenPromise(data)
                            .then((refToken)=>{
                                const authToken =  makeAuthToken(data);
                                res.cookie("refToken", refToken);
                                res.status(200).send(authToken);
                            });
                        }
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