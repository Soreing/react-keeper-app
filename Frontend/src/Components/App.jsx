import React, {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Notes from "./Notes.jsx";
import { AuthContext } from "../auth.js";
import "./Styles/App.css";

function App({notes}){

    const [loggedIn, setLoggedIn] = useState(false);

    return(
      <AuthContext.Provider value={{loggedIn, setLoggedIn}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="notes" element={<Notes notes={notes}/>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    )
}

export default App;