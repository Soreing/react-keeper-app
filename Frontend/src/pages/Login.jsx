import React, { useEffect, useContext } from "react";
import {useNavigate} from "react-router-dom";
import InputField from "../components/InputField.jsx";
import { login, AuthContext } from "../helpers/authentication.js";
import { animate, animatedNavigate } from "../helpers/common.js";
import { Error, emailformat, authServerDomain } from "../helpers/constants.js";
import google_logo from "../assets/svg/google_logo.svg";
import "../assets/styles/index.css";

function Login(){

    const [emailInput, setEmailInput] = React.useState("");         // Controlled Email field on the form
    const [passwordInput, setPasswordInput] = React.useState("");   // Controlled Password field on the form
    const [error, setError] = React.useState("");                   // Hidden error label for informing the user about errors

    const formRef = React.useRef();                                 // Reference to the div that contains the login form
    const errorRef = React.useRef();                                // Reference to the paragraph element that is used as an error display

    const navigate = useNavigate();                                 // Navigation hook to navigate to other routes
    const auth = useContext(AuthContext);                           // Authentication context to get/set the user's logged in state

    // Attempts to log the user in using the email and password entered
    // On Success, the loggedIn context is set, animation is played and the /notes page is shown
    // On Failure, an error is shown with a message
    function signIn(){
        if(emailInput && passwordInput){
            const email = emailInput.trim().toLowerCase();
            
            if(!emailformat.test(email)){
                showError(Error.invalidEmailFormat);
            }
            else {
                login(emailInput, passwordInput).then((res)=>{
                    auth.setLoggedIn(true);
                    animatedNavigate(navigate, "/notes", formRef, {name:"fade-out", time: 500});
                }).catch((err)=>{
                    showError(err);
                })
            }
        }
        else{
            showError(Error.missingFields);
        }
    }

    // Wraps setting the error in a function that also shakes the error field
    function showError(err){
        if(errorRef.current){
            animate(errorRef, "shake-lr-animation");
        }
        setError(err);
    }

    // On first render, add the slide-left-appear animation class on the form
    // The login form starts by sliding in from the right
    useEffect(()=>{        
        animate(formRef, "slide-left-appear");
    }, []);

    return (
      <div className="page center-container">
        <h1 className="page-title center-block mb2">Sign in to your account!</h1>
        
        <div className="form-container start-right" ref={formRef}>
          
          <div className="center-block mb1">
            <InputField label="Email" type="email" submit={signIn} value={emailInput} setValue={setEmailInput} />
          </div>
  
          <div className="center-block mb1">
            <InputField label="Password" type="password" submit={signIn} value={passwordInput} setValue={setPasswordInput} />
          </div>

          <button className="form-button center-block mb1" onClick={signIn}>Sign in</button>

          {error && <p className="center-block error-text mb2 shake-lr-animation"  ref={errorRef}>{error}</p>}

          <h2 className="center-block">Sign in with</h2>
          <div className="center-block oauth-container mb2">
            <form name="login-google" method="get" action={`${authServerDomain}/auth/google`}>
                <button className="oauth-button google-oauth"><img width="66%" src={google_logo} /></button>
            </form>

            <form name="login-facebook" method="get" action={`${authServerDomain}/auth/facebook`}>
                <button className="oauth-button facebook-oauth"><i className="fab fa-facebook-square fa-2x"/></button>
            </form>

            <form name="login-discord" method="get" action={`${authServerDomain}/auth/discord`}>
                <button className="oauth-button discord-oauth"><i className="fab fa-discord fa-2x"/></button>
            </form>

          </div>

        </div>

        <p >Don&apos;t have an accout?</p>
        <a className="nav-link" 
          onClick={(e)=>{ 
            e.preventDefault(); 
            animatedNavigate(navigate, "/register", formRef, {name:"slide-left-disappear", time: 500}); 
          }}
        >Sign up!</a>

      </div>
    );
}

export default Login;