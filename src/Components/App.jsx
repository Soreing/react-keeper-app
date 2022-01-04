import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Notes from "./Notes.jsx";
import "./Styles/App.css";

function App({notes}){

    return(
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
    )
}

export default App;