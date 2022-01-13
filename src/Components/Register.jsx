import React, { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import InputField from "./InputField.jsx";
import { register } from "../auth.js";
import "../index.css";

function Register(){

    const [emailInput, setEmailInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");
    const [pwdReapeatInput, setPwdRepeatInput] = React.useState("");
    const [error, setError] = React.useState("");
    
    const formRef = React.useRef();
    const errorRef = React.useRef();

    const navigate = useNavigate();

    function navigateRoute(event, route, anim){
        if(event){
            event.preventDefault();
        }

        if(anim){
            formRef.current.classList.add(anim.name);
            setTimeout(()=>{navigate(route, { replace: true })}, anim.time);
        } 
        else {
            navigate(route, { replace: true });
        }
    }

    function showError(err){
        if(errorRef.current){
            errorRef.current.classList.remove("shake-lr-animation");
            setTimeout(()=>{errorRef.current.classList.add("shake-lr-animation");}, 1);
        }
        setError(err);
    }

    function signUp(){
        if(emailInput && passwordInput && pwdReapeatInput){
            const processedEmail = emailInput.trim().toLowerCase();
            const emailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            const passwordformat = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\$%@\^&;\!\?\.\+\-\*\=_]).{8,32}$/;

            if(passwordInput !== pwdReapeatInput){
                showError("Passwords entered do not match");
                return;
            }

            if(!emailformat.test(processedEmail)){
                showError("Email address entered is not valid");
                return;
            }

            if(!passwordformat.test(passwordInput)){
                showError("Passwords must be between 8-32 characters and contain digits, lowercase and uppercase letters and a special character ($%@^&;!?.+-*=_)");
                return;
            }

            register(emailInput, passwordInput).then((res)=>{
                navigateRoute(null, "/login", {name:"fade-out", time: 500});
            }).catch((err)=>{
                showError(err);
            })
        }
        else{
            showError("Missing required fields");
        }
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
            <InputField label="Email" type="email" submit={signUp} value={emailInput} setValue={setEmailInput} />
          </div>
  
          <div className="center-block mb1">
            <InputField label="New Password" type="password" submit={signUp} value={passwordInput} setValue={setPasswordInput} />
          </div>

          <div className="center-block mb1">
            <InputField label="Repeat Password" type="password" submit={signUp} value={pwdReapeatInput} setValue={setPwdRepeatInput} />
          </div>
  
          <button className={`form-button center-block ${error?"mb1":"mb2"}`} onClick={signUp}>Sign up</button>

          {error && <p className="center-block error-text mb2"  ref={errorRef}>{error}</p>}
        </div>

        <p className="center-block">Already have an accout?</p>
        <a className="center-block nav-link" onClick={(e)=>navigateRoute(e,"/login")}>Sign in!</a>
      </div>
    );
}

export default Register;