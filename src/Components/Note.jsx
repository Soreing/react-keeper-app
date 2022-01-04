import React from "react";
import "./Styles/Note.css"

function Note(props){
    return(
        <div className="note">
            <h1>{props.title}</h1>
            <p>{props.content}</p>
            <div className="button-container">
                <button 
                    className="delete-button"
                    onClick={()=>{props.deleteNote(props.id)}}
                >
                    DELETE
                </button>
            </div>
        </div>
    )
}

export default Note;