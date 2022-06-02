import React from "react";
import "../assets/styles/components/Footer.css"

function Footer(){
    return(
        <footer>
            <p>Copyright &#169; {new Date().getFullYear()}</p> 
            <p><i className="fab fa-github"></i> <a href="https://github.com/Soreing">Soreing</a></p>
        </footer>
    )
}

export default Footer;