import React, { useState ,useEffect} from 'react';
import wel from "../assets/images/welcome.svg";
import './Welcome.css';
import Chat from '../pages/Chat';
import { useNavigate } from 'react-router-dom';






const Welcome = () => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
           null;
           setClicked(false);
      }
    };
    checkUser();
  }, [navigate]);

  const handleWelcome = () => {
    setClicked(true);
    console.log(`Pressed: ${clicked}`);
  };

  // If user has clicked "Enter", show the Chat screen
  if (clicked) {
    navigate("/chat");
  }

  // Otherwise show the Welcome screen
  return (
    <div className='welcome'>
      <div className="left-con">
        <h1>Hello!</h1>
        <div className="brand-text">
          <h2>Welcome to</h2> 
          <h2 className='brand'>drip</h2>
        </div>               
        <h3>Let's Chat Here</h3>
        <div className="but-con">
          <button onClick={handleWelcome}>Enter</button>
        </div>
      </div>
      <div className="right-con">
        <img src={wel} alt="Welcome" />
      </div>
    </div>
  );
};

export default Welcome;
