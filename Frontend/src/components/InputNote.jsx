import React from "react";
import PropTypes from "prop-types";
import "../assets/styles/components/Note.css";
import "../assets/styles/components/InputNote.css";

InputNote.propTypes = {
    addNote: PropTypes.func.isRequired,
};

// Stylized input element to create new notes by adding a title and a content
function InputNote({addNote}){
    
    // Input fields (title and content)
    const [note, setNote] = React.useState({
        title: "",
        content: ""
    });

    // If the user entered both a title and a content,
    // the note is submitted via a prop function and the inputs are reset
    function submitNote(){
        if(note.title && note.content){
            addNote(note.title, note.content);
        
            setNote({ 
                title: "",
                content: ""
            });
        }
    }

    // Controlled input function
    function updateNote(event){
        const {name, value} = event.target;
        setNote({ ...note, [name]: value});
    }
    
    return(
        <div className="input-note">
            <input 
                className="title" 
                name="title" 
                type="text" 
                value={note.title}
                placeholder="Title" 
                onChange={updateNote} >
            </input>

            <textarea 
                className="content" 
                name="content" 
                type="text" 
                value={note.content}
                placeholder="Take a note..." 
                onChange={updateNote}>
            </textarea>
            
            <div className="button-container">
                <button className="add-button" onClick={submitNote}><i className="fas fa-plus"></i></button>
            </div>
        </div>
    );
}

export default InputNote;