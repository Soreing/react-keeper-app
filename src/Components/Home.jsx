import React from "react";
import {Link} from "react-router-dom";
import "./Styles/Home.css";

function Home(){

    return (
      <div className="home">
        <h1>Take notes on the web and carry them with you wherever you go!</h1>
        <Link to="Login">Sign in to start taking notes</Link>
      </div>
    );
}

export default Home;