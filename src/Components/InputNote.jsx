import React from "react";
import "./Styles/Note.css";
import "./Styles/InputNote.css";

function InputNote(props){
    
    const [note, setNote] = React.useState({
        title: "",
        content: ""
    });

    function submitNote(){
        if(note.title != "" && note.content != ""){
            props.addNote(note.title, note.content);
        
            setNote({ 
                title: "",
                content: ""
            });
        }
    }

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
                <button className="add-button" onClick={submitNote}>Add</button>
            </div>
        </div>
    );
}

export default InputNote;