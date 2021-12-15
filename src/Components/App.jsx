import React from "react";
import Header from "./Header.jsx"
import Footer from "./Footer.jsx"
import Note from "./Note.jsx"
import InputNote from "./InputNote.jsx"
import "./App.css"


function App(props){
    
    const [notes, setNotes] = React.useState([...props.notes]);
    
    function addNote(title, content){
        setNotes(oldNotes => [...oldNotes, {
            title: title,
            content: content
        }]);
    }

    function deleteNote(idx){
        setNotes(oldNotes => oldNotes.filter((e,i) => i!==idx));
    }

    return(
        <div>
            <Header />
            <div className="input-container">
                <InputNote addNote={addNote}/>
            </div>
            {notes.map((e,i) => (
                <Note
                    key={i}
                    id={i}
                    title={e.title}
                    content={e.content}
                    deleteNote={deleteNote}
                />
            ))}
            <Footer />
        </div>
    )
}

export default App;