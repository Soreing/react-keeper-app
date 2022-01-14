import React from "react";
import PropTypes from "prop-types";
import "../assets/styles/components/Note.css"

Note.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    deleteNote: PropTypes.func.isRequired,
};

function Note({title, content, deleteNote}){
    return(
        <div className="note">
            <h1>{title}</h1>
            <p>{content}</p>
            <div className="button-container">
                <button 
                    className="delete-button"
                    onClick={deleteNote}
                >
                    DELETE
                </button>
            </div>
        </div>
    )
}

export default Note;