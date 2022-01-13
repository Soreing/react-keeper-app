import React from "react";
import "./Styles/InputField.css"

function InputField({label, type, submit, value, setValue}){
    
    const [display, setDisplay] = React.useState(type);
    const [labelAnim, setLabelAnim] = React.useState("");

    const inputRef = React.useRef();

    function toggleHide(e){
        if(type === "password"){
            setDisplay(display === "password" ? "text" : "password");
        }
    }

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