import React from "react";
import "./Styles/InputField.css"

function InputField({label, type}){
    
    const [inputValue, setInputValue] = React.useState("");
    const [display, setDisplay] = React.useState(type);
    const [labelAnim, setLabelAnim] = React.useState("");

    const inputRef = React.useRef();

    function toggleHide(e){
        if(type === "password"){
            setDisplay(display === "password" ? "text" : "password");
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
          value={inputValue}
          type={display}
          onFocus={()=>setLabelAnim("shrink")}
          onBlur={()=>{if(!inputValue){setLabelAnim("")}}}
          onChange={(e)=>{setInputValue(e.target.value)}}
          />
  
          <i className={`fas hide-button ${display === "password" ? "fa-eye" : "fa-eye-slash"}`}
          tabIndex="0"
          onClick={toggleHide}
          onFocus={(e)=>{e.stopPropagation();}}
          />
        </div>
      </div>
    )
}

export default InputField;