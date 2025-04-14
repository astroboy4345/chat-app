import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../../src/assets/images/loader1.gif";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Navigate, useNavigate } from "react-router-dom";

export default function AvatarPicker() {
  const navigate = useNavigate();  
  const api = "https://api.dicebear.com/7.x/avataaars/svg?seed=random";
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  const setAvatarProfilePicture = async () => {
    if (selectedAvatar === null) {
      toast.error("Please select an Avatar First", toastOptions);
    } else {
      const user = JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        alert("Avatar Setted Successfully");
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const data = [];
        for (let i = 0; i < 5; i++) {
          const response = await axios.get(
            `${api}/${Math.floor(Math.random() * 1000)}?format=svg`,
            { responseType: "text" }
          );
          const base64 = Buffer.from(response.data).toString("base64");
          data.push(base64);
        }
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching avatars:", error);
        toast.error("Failed to load avatars. Try again.", toastOptions);
      }
    };

    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <div className="load-image">
            <img src={loader} alt="Loading..." />
          </div>
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
              </div>
            ))}
          </div>
          <button className="set-avatar-btn" onClick={setAvatarProfilePicture}>Set Profile Picture</button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #131324;
  color: white;

  .title-container {
    margin-bottom: 20px;
  }

  .title-container h1 {
    font-size: 2rem;
  }

  .avatars {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .avatar {
    width: 100px;
    height: 100px;
    border: 4px solid transparent;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .avatar.selected {
    border-color: #4e0eff;
    transform: scale(1.1);
  }

  .set-avatar-btn {
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    background-color: #eb7171;
    color: #121212;
    border-radius: 35px;
    margin-top: 20px;
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }

  .set-avatar-btn:hover {
    background-color: #68eb9c;
    transform: scale(1.04);
  }

  .load-image img {
    height: 400px;
    width: 600px;
  }
`;
