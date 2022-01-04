import React, { useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import InputField from "./InputField.jsx";
import "../index.css";

function Register(){

    const [emailInput, setEmailInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");
    const [error, setError] = React.useState("");
    
    const formRef = React.useRef();
    const errorRef = React.useRef();

    const navigate = useNavigate();

    function navigateRoute(event, route){
        event.preventDefault();
        formRef.current.classList.add("slide-left-disappear");
        setTimeout(()=>{navigate(route, { replace: true })}, 500);
    }

    function register(){
        if(errorRef.current){
            errorRef.current.classList.remove("shake-lr-animation");
            setTimeout(()=>{errorRef.current.classList.add("shake-lr-animation");}, 1);
        }
        setError("This email is already registered");
    }

    useEffect(()=>{
        setTimeout(()=>{formRef.current.classList.add("slide-left-appear");}, 1);
    });

    useEffect(() => {
        if(errorRef.current){
            setTimeout(()=>{errorRef.current.classList.add("shake-lr-animation");}, 1);
        }
    }, [error, errorRef]);

    return (
      <div className="page">
        <h1 className="page-title center-block mb2">Create a new account!</h1>
        
        <div className="form-container start-right" ref={formRef}>
          <div className="center-block mb1">
            <InputField label="Email" type="email" value={emailInput} setValue={setEmailInput} />
          </div>
  
          <div className="center-block mb1">
            <InputField label="New Password" type="password" value={passwordInput} setValue={setPasswordInput} />
          </div>

          <div className="center-block mb1">
            <InputField label="Repeat Password" type="password" value={passwordInput} setValue={setPasswordInput} />
          </div>
  
          <button className={`form-button center-block ${error?"mb1":"mb2"}`} onClick={register}>Sign up</button>

          {error && <p className="center-block error-text mb2"  ref={errorRef}>{error}</p>}
        </div>

        <p className="center-block">Already have an accout?</p>
        <a className="center-block nav-link" onClick={(e)=>navigateRoute(e,"/login")}>Sign in!</a>
      </div>
    );
}

export default Register;