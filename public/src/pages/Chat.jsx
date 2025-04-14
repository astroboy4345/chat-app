import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUserRoute, host } from "../utils/APIRoutes";
import Contact from "../Components/Contact";
import Logout from "../Components/Logout/Logout";
import Interface from "../Components/Interface/Interface";
import UserDetails from "../Components/UserDetail/UserDetails";
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [logout, setLogout] = useState(false);
  const [select, setSelect] = useState(null);
  const [panel, setPanel] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const user = localStorage.getItem("chat-app-user");
      if (!user) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(user));
      }
    };
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          try {
            setLoading(true);
            const { data } = await axios.get(`${allUserRoute}/${currentUser._id}`);
            setContacts(data);
            setLoading(false);
          } catch (error) {
            console.error("Failed to fetch contacts:", error);
            setLoading(false);
          }
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  return (
    <Container>
      <div className="container">
        <Contact
          contacts={contacts}
          currentUser={currentUser}
          log={logout}
          setLog={setLogout}
          select={select}
          setSelect={setSelect}
        />
        <div className="chat-placeholder">
          {logout && currentUser && (
            <Logout currentUser={currentUser} log={logout} setLog={setLogout} />
          )}

          {!panel && currentUser && select !== null && (
            <Interface
              select={select}
              contacts={contacts}
              panel={panel}
              currentUser={currentUser}
              setPanel={setPanel}
              socket={socket}
            />
          )}

          {!panel && currentUser && select === null && (
            <p>Please select a contact to start chatting.</p>
          )}

          {panel && currentUser && select !== null && (
            <UserDetails
              setPanel={setPanel}
              panel={panel}
              select={select}
              contacts={contacts}
            />
          )}

          {loading && !contacts.length && <p>Loading contacts...</p>}
        </div>
      </div>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 1rem;
    overflow: hidden;
  }

  .chat-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    font-weight: 500;
    text-align: center;
    padding: 1rem;
  }
`;
