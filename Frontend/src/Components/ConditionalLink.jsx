import React from "react"
import {useNavigate} from "react-router-dom"

function ConditionalLink({to, toEffect, alt, altEffect, condition, conditionType, className, children}){
    
    const navigate = useNavigate();

    function link(event){
        event.preventDefault();

        function execute(result){
            if(result){
                toEffect();
                navigate(to);
            } else {
                altEffect();
                navigate(alt);
            }
        }

        switch(conditionType){
            case "promise":  condition().then((val)=> {execute(val);}); break;
            case "function": execute(condition()); break;
            case "value":    execute(condition); break;
            default:         execute(condition); break;
        }
    }

    return(
      <a className={className} 
        href={to} 
        onClick={link}
      >{children}</a>
    );
}

export default ConditionalLink;