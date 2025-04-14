import React, { useState, useEffect } from 'react';
import './Logout.css';
import { useNavigate } from 'react-router-dom';
import logout from "../../assets/images/switch.png"
import no from "../../assets/images/no.png"
const Logout = ({ currentUser, log , setLog}) => {
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username || "");
      setCurrentUserImage(currentUser.avatarImage || "");
    }
  }, [currentUser]);

  const handleLogout = () => {
    console.log("Logout");
    localStorage.removeItem("chat-app-user");
    navigate("/login");
  };

  const handleClose = () =>{
      setLog(!log);
  }

  return (
    <div className='logout'>
      <div className="con">
         <div className="pic">
        <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="Profile" />
      </div>
      <div className="log-detail">
        <h3>Username : {currentUserName}</h3>
        <h3>Email : {currentUser?.email || "No email available"}</h3>
      </div>
      </div>
      <div className="logout-button" onClick={handleLogout}>
         <img src={logout} alt="Logout" />
      </div>
      <div className="exit" onClick={handleClose}>
          <img src={no} alt="Exit" />
      </div>
    </div>
  );
};

export default Logout;
