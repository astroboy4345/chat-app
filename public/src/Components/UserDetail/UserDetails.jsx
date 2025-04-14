import React, { useEffect, useState } from 'react';
import contact from "../../assets/images/contact.png";
import back from "../../assets/images/back.png"
import './UseDetails.css';


const UserDetails = ({ panel, setPanel, select, contacts }) => {
  const [chatUserName, setChatUserName] = useState("");
  const [chatUserAvatar, setChatUserAvatar] = useState("");
  const [chatUserEmail, setChatUserEmail] = useState("");

  const handleBack = () => {
    setPanel(!panel);
  };

  useEffect(() => {
    if (select !== null && contacts?.length > 0) {
      const selectedUser = contacts[select];
      if (selectedUser) {
        setChatUserName(selectedUser.username);
        setChatUserEmail(selectedUser.email);
        setChatUserAvatar(selectedUser.avatarImage);
      }
    }
  }, [contacts, select]);

  return (
    <div className="UserSection">
      <div className="avatar-image">
        <img
          src={chatUserAvatar ? `data:image/svg+xml;base64,${chatUserAvatar}` : contact}
          alt="User Avatar"
        />
        <p>{chatUserName || "Please Choose a User First"}</p>
        {chatUserEmail && <p>{chatUserEmail}</p>}
      </div>
      <button onClick={handleBack}><img src={back} alt="Back"  className='Back'/></button>
    </div>
  );
};

export default UserDetails;
