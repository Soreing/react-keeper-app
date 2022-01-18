import React from "react";
import PropTypes from "prop-types";
import "../assets/styles/index.css";

Info.propTypes = {
  text: PropTypes.string.isRequired,
};


function Info({text}){
    return (
      <div className="page center-container">
        <h1 className="page-title center-block">{text}</h1>
      </div>
    );
}

export default Info;