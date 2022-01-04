import React from "react";
import {Outlet} from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "./Styles/Layout.css";

function Layout(){
    return(
      <div>
          <Header />
          <Outlet />
          <Footer />
      </div>
    )
}

export default Layout;