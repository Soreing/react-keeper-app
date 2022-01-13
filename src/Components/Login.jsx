import React, { useEffect, useContext } from "react";
import {useNavigate} from "react-router-dom";
import InputField from "./InputField.jsx";
import { login, AuthContext } from "../auth.js";

import "../index.css";

function Login(){

    const [emailInput, setEmailInput] = React.useState("");
    const [passwordInput, setPasswordInput] = React.useState("");
    const [error, setError] = React.useState("");

    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const formRef = React.useRef();
    const errorRef = React.useRef();

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

    function signIn(){
        
        if(emailInput && passwordInput){
            const processedEmail = emailInput.trim().toLowerCase();
            const emailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            if(emailformat.test(processedEmail)){
                login(emailInput, passwordInput).then((res)=>{
                    auth.setLoggedIn(true);
                    navigateRoute(null, "/notes", {name:"fade-out", time: 500});
                }).catch((err)=>{
                    showError(err);
                })
            }
            else {
                showError("Email address entered is not valid");
            }
        }
        else{
            showError("Missing required fields");
        }
    }

    useEffect(()=>{        
        setTimeout(()=>{formRef.current.classList.add("slide-left-appear");}, 1);
    }, []);

    useEffect(() => {
        if(errorRef.current){
            setTimeout(()=>{errorRef.current.classList.add("shake-lr-animation");}, 1);
        }
    }, [error, errorRef]);

    return (
      <div className="page">
        <h1 className="page-title center-block mb2">Sign in to your account!</h1>
        
        <div className="form-container start-right" ref={formRef}>
          
          <div className="center-block mb1">
            <InputField label="Email" type="email" submit={signIn} value={emailInput} setValue={setEmailInput} />
          </div>
  
          <div className="center-block mb1">
            <InputField label="Password" type="password" submit={signIn} value={passwordInput} setValue={setPasswordInput} />
          </div>

          <button className={`form-button center-block ${error?"mb1":"mb2"}`} onClick={signIn}>Sign in</button>

          {error && <p className="center-block error-text mb2"  ref={errorRef}>{error}</p>}
        </div>

        <p className="center-block">Don't have an accout?</p>
        
        <a className="center-block nav-link" 
          onClick={(e)=>navigateRoute(e,"/register", {name:"slide-left-disappear", time: 500})}
        >Sign up!</a>

      </div>
    );
}

export default Login;