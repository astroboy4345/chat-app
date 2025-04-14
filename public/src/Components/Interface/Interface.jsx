import React, { useEffect, useState } from 'react';
import contact from "../../assets/images/contact.png";
import './Interface.css';
import EmojiPicker from "emoji-picker-react";
import robot from "../../assets/images/roboto.gif";
import send from "../../assets/images/send.png";
import axios from 'axios';
import { fetchMessageRoute, sendMessageRoute } from '../../utils/APIRoutes';

const Interface = ({ contacts, select, panel, setPanel, currentUser, socket }) => {
  const [userImage, setImage] = useState("");
  const [userName, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [data, setData] = useState("");
  const [store, setStore] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleData = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const selectedUser = contacts[select];
    if (!data.trim()) return;

    try {
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: selectedUser._id,
        message: data,
      });

      socket.current.emit("send-msg", {
        to: selectedUser._id,
        from: currentUser._id,
        msg: data,
      });

      setStore((prev) => [...prev, { message: data, fromSelf: true }]);
      setData("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleChatUserDetails = () => {
    setPanel(!panel);
  };

  useEffect(() => {
    if (contacts && contacts.length > 0 && select !== null && currentUser) {
      const selectedUser = contacts[select];
      if (selectedUser) {
        setImage(selectedUser.avatarImage);
        setName(selectedUser.username);
        setEmail(selectedUser.email);
      }
    }
  }, [contacts, select]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (contacts && contacts.length > 0 && select !== null && currentUser) {
        const selectedUser = contacts[select];
        try {
          const response = await axios.post(fetchMessageRoute, {
            from: currentUser._id,
            to: selectedUser._id,
          });

          const messages = response.data.map((msg) => ({
            message: msg.message,
            fromSelf: msg.fromSelf,
          }));

          setStore(messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [contacts, select, currentUser]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (msg) => {
        setStore((prev) => [...prev, { fromSelf: false, message: msg }]);
      });
    }
  }, [socket]);

  return (
    <div className='containers'>
      <div className="upper-panel" onClick={handleChatUserDetails}>
        <img src={userImage ? `data:image/svg+xml;base64,${userImage}` : contact} alt="user" />
        <p>{userName ? userName : "Please Choose a User First"}</p>
      </div>

      <div className={select !== null ? "mid-panel" : "highlight"}>
        {select !== null ? (
          store.map((msg, index) => (
            <div className={`message ${msg.fromSelf ? 'sent' : 'received'}`} key={index}>
              <p>{msg.message}</p>
            </div>
          ))
        ) : (
          <img src={robot} alt="robot" />
        )}
      </div>

      <div className="input-panel">
        {select !== null && (
          <div className="input-container-msg">
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowPicker(!showPicker)}>🙂</button>
              {showPicker && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "50px",
                    right: "0",
                    zIndex: 1000,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    borderRadius: "12px"
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={(emojiData) => setData((prev) => prev + emojiData.emoji)}
                    theme="light"
                  />
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder='Enter Your Message Here...'
              value={data}
              onChange={(e) => setData(e.target.value)}
              onKeyDown={handleData}
            />
            <div className="send-btn" onClick={handleData}>
              <img src={send} alt="send" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interface;
