import React from "react";
import {Link} from "react-router-dom";
import "../index.css";

function Home(){

    return (
      <div className="page">
        <h1 className="page-title center-block">Take notes on the web and carry them with you wherever you go!</h1>
        <Link className="center-block" to="Login">Sign in to start taking notes</Link>
      </div>
    );
}

export default Home;