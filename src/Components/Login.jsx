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

          <button className="form-button center-block mb1" onClick={signIn}>Sign in</button>

          {error && <p className="center-block error-text mb2"  ref={errorRef}>{error}</p>}

          <h2 className="center-block">Sign in with</h2>
          <div className="center-block oauth-container mb2">
            <form name="login-google" method="post" action="http://localhost:8081/auth/google">
                <button className="oauth-button google-oauth"><i className="fab fa-google fa-2x"/></button>
            </form>

            <form name="login-google" method="post" action="http://localhost:8081/auth/facebook">
                <button className="oauth-button facebook-oauth"><i className="fab fa-facebook-square fa-2x"/></button>
            </form>

            <form name="login-google" method="post" action="http://localhost:8081/auth/discord">
                <button className="oauth-button discord-oauth"><i className="fab fa-discord fa-2x"/></button>
            </form>

          </div>

        </div>

        <p className="center-block">Don't have an accout?</p>
        <a className="center-block nav-link" 
          onClick={(e)=>navigateRoute(e,"/register", {name:"slide-left-disappear", time: 500})}
        >Sign up!</a>

      </div>
    );
}

export default Login;