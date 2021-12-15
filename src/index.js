import React from "react";
import ReactDOM from "react-dom";
import App from  "./Components/App.jsx"
import notes from "./notes.js";
import "./index.css";

ReactDOM.render(<App notes={notes} />, document.querySelector("#root"));