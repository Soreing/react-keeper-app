import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./Layout.jsx";
import Notes from "./Notes.jsx";
import "./App.css";

function App({notes}){

    return(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<Notes notes={notes}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
}

export default App;