import React from "react";
import PropTypes from "prop-types";
import "../assets/styles/components/InputField.css"

InputField.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    submit: PropTypes.func,
    value: PropTypes.string.isRequired,
    setValue: PropTypes.func.isRequired,
};

// Stylized input field for taking user input
function InputField({label="", type="text", submit, value, setValue}){
    
    const [display, setDisplay] = React.useState(type);     // Current display mode (text or password)
    const [labelAnim, setLabelAnim] = React.useState("");   // Animation CSS class on the input field label

    const inputRef = React.useRef();                        // Reference to the input field html element

    // Toggles the display mode of the input field between text and password
    // Executed when the user clicks the eye icon next to the input field
    function toggleHide(e){
        if(type === "password"){
            setDisplay(display === "password" ? "text" : "password");
        }
    }

    // Executes a submit function when the user presses the Enter key in the field
    // If no function is given as a prop, no function will be called
    function submitOnEnter(e){
        if(submit && e.key === "Enter"){
            submit();
        }
    }

    return (
      <div 
        className="input-field-component"
        tabIndex="0" 
        onFocus={(e)=>{inputRef.current.focus()}}
      >
        <label className={`input-field-label ${labelAnim}`}>{label}</label>
        
        <div className="input-field-box">
          <input 
          className="input-field-box"
          ref={inputRef}
          value={value}
          type={display}
          onKeyPress={submitOnEnter}
          onFocus={()=>setLabelAnim("shrink")}
          onBlur={()=>{if(!value){setLabelAnim("")}}}
          onChange={(e)=>{setValue(e.target.value)}}
          />
  
        <i className={`fas hide-button ${type !== "password" ? "" : display === "password" ? "fa-eye" : "fa-eye-slash"}`}
          tabIndex={type === "password" ? "0" : "-1"}
          onClick={toggleHide}
          onFocus={(e)=>{e.stopPropagation();}}
          />
        </div>
      </div>
    )
}

export default InputField;