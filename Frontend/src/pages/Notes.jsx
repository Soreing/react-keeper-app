import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Note from "../components/Note.jsx"
import InputNote from "../components/InputNote.jsx"
import { apiAxios } from "../helpers/axiosInstances";
import { getToken, AuthContext } from "../helpers/authentication.js";
import "../assets/styles/index.css";


function Notes(){
    
    const [notes, setNotes] = React.useState([]);   // List of notes to be rendered on the page
    
    const navigate = useNavigate();                 // Navigation hook to navigate to other routes
    const auth = useContext(AuthContext);           // Authentication context to get/set the user's logged in state

    // Code that runs when the session is timed out
    // The user is set to logged out and /login is rendered
    function sessionTimedOut(){
        auth.setLoggedIn(false);
        navigate("/login");
    }

    // Requests the API to add a new note for the user
    // If the request is successful, a new note is added on the page
    function addNote(title, content){
        const newNote = {
            title: title,
            content: content
        };
        
        apiAxios.post("/notes", newNote, {
            headers: {
              'Authorization': `Bearer ${getToken()}`
            }
        })
        .then((res)=>{
            setNotes(oldNotes => [...oldNotes, {
                id: res.data,
                title: title,
                content: content
            }]);
        })
        .catch((err)=>{
            if(err.response.status === 401){
                sessionTimedOut();
            }
        });

    }

    // Requests the API to delete a specific note for the user
    // If the request is successful, the note is removed from the page
    function deleteNote(id){
        apiAxios.delete(`/notes/${id}`, {
            headers: {
              'Authorization': `Bearer ${getToken()}`
            }
        })
        .then((res)=>{
            setNotes(oldNotes => oldNotes.filter(e => e.id !== id));
        })
        .catch((err)=>{
            if(err.response.status === 401){
                sessionTimedOut();
            }
        });
    }

    // On first load of the page, requests the API to send all notes from the user
    // If the request is successful, the notes are rendered.
    useEffect(()=>{        
        apiAxios.get("/notes", {
            headers: {
              'Authorization': `Bearer ${getToken()}`
            }
        })
        .then((res)=>{
            auth.setLoggedIn(true);
            setNotes(res.data);
        })
        .catch((err)=>{
            if(err.response.status === 401){
                sessionTimedOut();
            }
        });

    }, []);

    return(
        <div className="page center-container">
            <div className="center-container">
                <InputNote addNote={addNote}/>
            </div>
            {notes.map(e => (
                <Note
                    key={e.id}
                    title={e.title}
                    content={e.content}
                    deleteNote={()=>deleteNote(e.id)}
                />
            ))}
        </div>
    )
}

export default Notes;