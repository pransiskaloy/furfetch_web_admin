import "./fare.scss";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs';

export default function Fare() {

    
  return (
      <div className="fare">
        <Sidebar />
        <div className="fareContainer">
          <Navbar />
          <div className="fareTitle">
            Fare Setting
          </div>
        </div>
      </div>
      )
}
