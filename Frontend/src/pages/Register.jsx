import React, { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import InputField from "../components/InputField.jsx";
import LoadingDots from "../components/LoadingDots.jsx";
import { register } from "../helpers/authentication.js";
import { animate, animatedNavigate } from "../helpers/common.js";
import { Error, emailformat, passwordformat } from "../helpers/constants.js";
import "../assets/styles/index.css";

function Register(){

    const [emailInput, setEmailInput] = React.useState("");             // Controlled Email field on the form
    const [passwordInput, setPasswordInput] = React.useState("");       // Controlled Password field on the form
    const [pwdReapeatInput, setPwdRepeatInput] = React.useState("");    // Controlled Repeat Password field on the form
    const [error, setError] = React.useState("");                       // Hidden error label for informing the user about errors
    const [loading, setLoading] = React.useState(false);                // Loading state of the form after it's sent to the API
    
    const formRef = React.useRef();                                     // Reference to the div that contains the login form
    const errorRef = React.useRef();                                    // Reference to the paragraph element that is used as an error display

    const navigate = useNavigate();                                     // Navigation hook to navigate to other routes

    // Attempts to register the user using email and password entered
    // On Successful, [UNFINISHED], but redirect to "/login"
    // On Failure, an error is shown with a message
    function signUp(){
        if(!loading && emailInput && passwordInput && pwdReapeatInput){
            const email = emailInput.trim().toLowerCase();

            if(passwordInput !== pwdReapeatInput){
                showError(Error.pwdRepeatMismatch);
            }
            else if(!emailformat.test(email)){
                showError(Error.invalidEmailFormat);
            }
            else if(!passwordformat.test(passwordInput)){
                showError(Error.invalidPasswordFormat);
            }
            else {
                setLoading(true);
                register(emailInput, passwordInput).then((res)=>{
                    animatedNavigate(navigate, "/verification", formRef, {name:"fade-out", time: 500});
                    setLoading(false);
                }).catch((err)=>{
                    setLoading(false);
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
  
          <button className={`form-button center-block ${error?"mb1":"mb2"}`} onClick={signUp}>{loading ? <LoadingDots /> : <span>Sign up</span>}</button>

          {error && <p className="center-block error-text mb2 shake-lr-animation"  ref={errorRef}>{error}</p>}
        </div>

        <p>Already have an accout?</p>
        <a className="nav-link" 
          onClick={(e)=>{ 
            e.preventDefault(); 
            animatedNavigate(navigate, "/login", formRef, {name:"slide-left-disappear", time: 500}); 
          }}
        >Sign in!</a>
      </div>
    );
}

export default Register;