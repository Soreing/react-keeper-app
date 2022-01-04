import React from "react";
import {useNavigate} from "react-router-dom";
import "./Styles/Header.css";

function Header(){
    const navigate = useNavigate();
    return(
        <header>
            <h1 onClick={()=>navigate("/")}>Keeper App</h1>
        </header>
    );
}

export default Header;