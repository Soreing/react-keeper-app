import React, { useContext } from "react";
import {useNavigate} from "react-router-dom";
import {logout, AuthContext} from "../helpers/authentication.js";
import "../assets/styles/components/Header.css";

function Header(){
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    
    // Sign out function called when the user clicks the logout button
    // If successful, sets the user to logged out and navigates to route "/"
    function signOut(){
        logout()
        .then(()=>{
            auth.setLoggedIn(false);
            navigate("/");
        });
    }


    return(
      <header>
        <h1 onClick={()=>navigate("/")}>Keeper App</h1>
          <div className="auth-div">
            { auth.loggedIn && <p className="small-text">Signed in as<br/>XYZ</p>}
            { auth.loggedIn 
              ? <button className="border-button" onClick={signOut}>Log Out</button>
              : <button className="border-button">Log In</button>
            }
          </div>
      </header>
    );
}

export default Header;