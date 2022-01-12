import React, { useEffect } from "react";
import Note from "./Note.jsx"
import InputNote from "./InputNote.jsx"
import { expiredTokenIntercept, getToken } from "../auth.js";
import axios from "axios";
import "./Styles/Notes.css"


function Notes(props){
    
    const [notes, setNotes] = React.useState([]);
    
    const apiAxios = axios.create({
        baseURL: "http://localhost:8081",
        withCredentials: true
    });

    apiAxios.interceptors.response.use(null, expiredTokenIntercept)

    function addNote(title, content){
        const newNote = {
            title: title,
            content: content
        };
        
        apiAxios.post("/notes", newNote, {
            headers: {
              'Authorization': `bearer ${getToken()}`
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

        });

    }

    function deleteNote(id){
        apiAxios.delete(`/notes/${id}`, {
            headers: {
              'Authorization': `bearer ${getToken()}`
            }
        })
        .then((res)=>{
            setNotes(oldNotes => oldNotes.filter(e => e.id !== id));
        })
        .catch((err)=>{
            
        });
    }

    useEffect(()=>{        
        apiAxios.get("/notes", {
            headers: {
              'Authorization': `bearer ${getToken()}`
            }
        })
        .then((res)=>{
            setNotes(res.data);
        })
        .catch((err)=>{
            
        });

    }, []);

    return(
        <div>
            <div className="input-container">
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