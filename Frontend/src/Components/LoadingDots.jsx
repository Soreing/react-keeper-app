import React from "react";
import "../assets/styles/components/LoadingDots.css";

function LoadingDots(){
    return (
        <span className="loading-dots-container">
            <span className="loading-dot"/>
            <span className="loading-dot"/>
            <span className="loading-dot"/>
        </span>
    );
}

export default LoadingDots;