import React, { useEffect, useContext } from "react";
import Note from "./Note.jsx"
import InputNote from "./InputNote.jsx"
import { expiredTokenIntercept, getToken, AuthContext } from "../auth.js";
import axios from "axios";
import "./Styles/Notes.css"
import { useNavigate } from "react-router-dom";


function Notes(props){
    
    const [notes, setNotes] = React.useState([]);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    
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
            if(err.response.status === 401){
                auth.setLoggedIn(false);
                navigate("/login");
            }
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
            if(err.response.status === 401){
                auth.setLoggedIn(false);
                navigate("/login");
            }
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
            if(err.response.status === 401){
                auth.setLoggedIn(false);
                navigate("/login");
            }
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