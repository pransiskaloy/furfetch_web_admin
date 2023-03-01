import "./profile.scss";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React from 'react'

export default function Profile() {

    
  return (
      <div className="profile">
        <Sidebar />
        <div className="profileContainer">
            <Navbar />
        </div>
      </div>
      )
}
