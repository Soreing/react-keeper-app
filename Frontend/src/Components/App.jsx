import React, {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "../pages/Layout.jsx";
import Info from "../pages/Info.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Notes from "../pages/Notes.jsx";
import {AuthContext, getTokenData} from "../helpers/authentication.js";
import {defaultUserLoginState} from "../helpers/constants.js";

function App(){

    const [loginState, setloginState] = useState(defaultUserLoginState);

    const verificationText = "We sent you an email to verify your account. You need to be verified before you can log in.";
    const badTokenText = "Verification token is either invalid or expired. Please sign up again to get a new token.";

    function setLogin(state) {
        if(state == true){
            const userDetails = getTokenData();
            setloginState({
                loggedIn: true,
                name: userDetails.name,
                id: userDetails.id,
            })
        }
        else {
            setloginState(defaultUserLoginState)
        }
    }

    return(
      <AuthContext.Provider value={{loginState, setLogin}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home />} />
              <Route path="verification" element={<Info text={verificationText} />} />
              <Route path="bad-token" element={<Info text={badTokenText} />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="notes" element={<Notes />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    )
}

export default App;