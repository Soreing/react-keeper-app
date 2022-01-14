import React, {useState} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "../pages/Layout.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Notes from "../pages/Notes.jsx";
import { AuthContext } from "../helpers/authentication.js";

function App(){

    const [loggedIn, setLoggedIn] = useState(false);

    return(
      <AuthContext.Provider value={{loggedIn, setLoggedIn}}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<Home />} />
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