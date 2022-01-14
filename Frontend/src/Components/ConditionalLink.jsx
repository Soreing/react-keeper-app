import React from "react"
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom"

ConditionalLink.propTypes = {
    to: PropTypes.string.isRequired,
    toEffect: PropTypes.func,
    alt: PropTypes.string,
    altEffect: PropTypes.func,
    condition: PropTypes.any,
    conditionType: PropTypes.oneOf(["promise", "function", "value"]),
    className: PropTypes.string,
    children: PropTypes.any,
};

// Conditionally nagigates the user to another route "to"
// If the condition fails, the user is navigated to an alternative "alt" route
// Custom logic "Effect" can be injected that runs before the user is navigated to "to" or "alt" 
function ConditionalLink({to, toEffect, alt, altEffect, condition, conditionType, className, children}){
    
    const navigate = useNavigate();

    // Function called when the user clicks on the link
    function link(event){
        event.preventDefault();

        // Execution logic called when the condition is evaluated
        function execute(result){
            if(result){
                toEffect();
                navigate(to);
            } else if(alt) {
                altEffect();
                navigate(alt);
            }
        }

        // Evaluate the condition based on its types
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