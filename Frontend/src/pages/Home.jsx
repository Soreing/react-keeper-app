import React, {useContext} from "react";
import ConditionalLink from "../components/ConditionalLink.jsx";
import { isAuthenticated, AuthContext } from "../helpers/authentication.js";
import "../assets/styles/index.css";

function Home(){

    const auth = useContext(AuthContext);

    return (
      <div className="page">
        <h1 className="page-title center-block">Take notes on the web and carry them with you wherever you go!</h1>

        <ConditionalLink className="center-block"
          to="notes" toEffect={() => auth.setLoggedIn(true)}
          alt="login" altEffect={() => auth.setLoggedIn(false)}
          condition={isAuthenticated} conditionType="promise"
        >Start taking notes</ConditionalLink>
        
      </div>
    );
}

export default Home;