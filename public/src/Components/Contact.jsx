import React, { useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../assets/images/logox1.png";

const Contact = ({ contacts, currentUser , log ,setLog,setSelect}) => {
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserImage, setCurrentUserImage] = useState("");
  const [currentSelected, setCurrentSelected] = useState(null);
  const handlelog = () =>{
       setLog(!log);
  }

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index) => {
    setCurrentSelected(index);
    setSelect(index);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={logo} alt="logo" />
            <h3>drip</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={index}
                  className={`contact ${index === currentSelected ? "selected" : ""}`}
                  onClick={() => changeCurrentChat(index)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt={`${contact.username}'s avatar`}
                    />
                  </div>
                  <div className="username">
                    <h2>{contact.username}</h2>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user" onClick={handlelog}>
            <img
              src={`data:image/svg+xml;base64,${currentUserImage}`}
              alt={`${currentUserName}'s avatar`}
            />
            <h2>{currentUserName}</h2>
          </div>
        </Container>
      )}
    </>
  );
};

export default Contact;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background-color: #080420;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 20px;
    color: white;
    justify-content: center;
    padding: 1rem 0;

    img {
      height: 2rem;
    }
  }

  .contacts {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    .contact {
      background-color: #ffffff34;
      border-radius: 0.5rem;
      padding: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: 0.3s ease-in-out;

      &.selected {
        background-color: #9a86f3;
      }

      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
        }
      }

      .username {
        h2 {
          color: white;
          font-size: 1rem;
        }
      }
    }
  }

  .current-user {
    background-color: #0d0d30;
    width: 100%;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 3rem;
      border-radius: 50%;
    }

    h2 {
      color: white;
    }
  }
`;
