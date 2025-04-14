import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from "../assets/images/logox.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from '../utils/APIRoutes';

const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({ username: "", password: "" });

    const toastOption = {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    };

    useEffect(() => {
      if (localStorage.getItem('chat-app-user')) {
        navigate('/');
      }
    }, [navigate]);
    

    const handleValidation = () => {
        const { username, password } = values;
        
        if (!username || !password) {
            toast.error("All fields are required", toastOption);
            return false;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters", toastOption);
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!handleValidation()) return;

        try {
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, { username, password });

            if (!data.status) {
                toast.error(data.msg, toastOption);
                return;
            }

            localStorage.setItem("chat-app-user", JSON.stringify(data.user));
            navigate("/welcome");
            
        } catch (error) {
            toast.error("Something went wrong. Try again later.", toastOption);
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer />
            <FormContainer>
                <form onSubmit={handleSubmit}>
                    <div className="brand">
                        <img src={logo} alt="Logo" />
                        <h1 style={{ fontFamily: "'Lobster', cursive" }}>Drip</h1>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Username"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Login</button>
                    <span>Don't have an account? <Link to="/register">Register</Link></span>
                </form>
            </FormContainer>
        </>
    );
};

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    padding: 30px;
    background-color: #1f1f56;

    .brand {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
            height: 11rem;
            width: 11rem;
        }
        h1 {
            color: white;
            font-size: 3rem;
            font-weight: bold;
            background: linear-gradient(to right, #ffdde1, #ee9ca7);
            -webkit-text-fill-color: transparent;
            -webkit-background-clip: text;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        background-color: rgba(2, 2, 2, 0.6);
        border-radius: 5rem;
        align-items: center;
        justify-content: center;
        padding: 3rem 5rem;
        gap: 1.5rem;
        
        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;
            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
                background-color: #111111;
            }
        }
        
        button {
            background-color: #f36643;
            color: white;
            padding: 1rem 2rem;
            border-radius: 6px;
            cursor: pointer;
            border: none;
            font-weight: bold;
            font-size: 1rem;
            width: 60%;
            border-radius: 30px;
            text-transform: uppercase;
            transition: 0.6s;
        }

        button:hover {
            transform: scale(1.09);
            background-color: #47ed58;
        }

        span {
            color: white;
            a {
                text-decoration: none;
                font-weight: bold;
            }
        }
    }
`;

export default Login;
