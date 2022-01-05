import React from "react"
import {useNavigate} from "react-router-dom"
import { getToken, isAuthenticated } from "../auth.js";

function ConditionalLink({to, alt, condition, className, children}){
    
    const navigate = useNavigate();

    function link(event){
        event.preventDefault();

        isAuthenticated(getToken()).then((val)=>{
            if(!val){ navigate(to); }
            else { navigate(alt); }
        });
    }

    return(
      <a className={className} 
        href={to} 
        onClick={link}
      >{children}</a>
    );
}

export default ConditionalLink;