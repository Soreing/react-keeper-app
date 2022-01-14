import React from "react";
import "../assets/styles/components/Footer.css"

function Footer(){
    return(
        <footer>
            <p>Copyright &#169; {new Date().getFullYear()}</p>
        </footer>
    )
}

export default Footer;