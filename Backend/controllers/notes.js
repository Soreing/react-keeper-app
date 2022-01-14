import {User, ObjectId} from "../database.js"

// Returns all notes of the user
// The user is identified by the ID field in the JWT used for authentication
exports.getAllNotes = (req, res, next)=>{
    const userObjectId = new ObjectId(req.user.id);
    
    User.findOne({_id: userObjectId}, (findErr, user)=>{
        if(!findErr){
            if(user){
                const notes = user.notes.map(e => { 
                    return {
                        id:      e._id.toString(), 
                        title:   e.title, 
                        content: e.content
                    }
                });
                res.json(notes);
            } else {
                res.status(404).send("User not in the database");
            }
        } else {
            console.log(findErr);
            res.sendStatus(500);
        }
    });
}

// Returns one note of the user
// The note is searched by the ID provided in the route parameters
// The user is identified by the ID field in the JWT used for authentication
exports.getOneNote = (req, res, next)=>{
    const userObjectId = new ObjectId(req.user.id);

    User.findOne({_id: userObjectId}, (findErr, user)=>{
        if(!findErr){
            if(user){
                const note = user.notes.find( e => e._id.toString() === req.params.noteid);

                if(note){
                    res.json({
                        id:      note._id.toString(), 
                        title:   note.title, 
                        content: note.content
                    });
                } else {
                    res.status(404).send("Note not in the database");
                }
            } else {
                res.status(404).send("User not in the database");
            }
        } else {
            console.log(findErr);
            res.sendStatus(500);
        }
    });
}

// Creates a new note for the user
// title and content should be sent in the request body
// The user is identified by the ID field in the JWT used for authentication
exports.createOneNote = (req, res, next)=>{
    const userObjectId = new ObjectId(req.user.id);

    if(req.body.title && req.body.content){
        const newNote = {
            _id: new ObjectId(),
            title: req.body.title,
            content: req.body.content
        };

        User.findOneAndUpdate( {_id: userObjectId}, {$push: {notes: newNote}}, (findErr, user)=>{
            if(!findErr){
                if(user){
                    res.send(newNote._id);
                } else {
                    res.status(404).send("User not in the database");
                }
            } else {
                console.log(findErr);
                res.sendStatus(500);
            }
        });
    } else {
        res.status(400).send("Incomplete details");
    }
}

// Deletes all notes of the user
// The user is identified by the ID field in the JWT used for authentication
exports.deleteAllNotes = (req, res, next)=>{
    const userObjectId = new ObjectId(req.user.id);

    User.findOneAndUpdate( {_id: userObjectId}, {notes: []}, (findErr, user)=>{
        if(!findErr){
            if(user){
                res.sendStatus(200);
            } else {
                res.status(404).send("User not in the database");
            }
        } else {
            console.log(findErr);
            res.sendStatus(500);
        }
    });
}

// Deletes one note of the user
// The note is searched by the ID provided in the route parameters
// The user is identified by the ID field in the JWT used for authentication
exports.deleteOneNote = (req, res, next)=>{
    const userObjectId = new ObjectId(req.user.id);
    const selector = {
        _id: new ObjectId(req.params.noteid),
    }; 

    User.findOneAndUpdate( {_id: userObjectId}, {$pull: {notes: selector}}, (findErr, user)=>{
        if(!findErr){
            if(user){
                res.sendStatus(200);
            } else {
                res.status(404).send("User not in the database");
            }
        } else {
            console.log(findErr);
            res.sendStatus(500);
        }
    });
}