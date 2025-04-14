import React, { useState } from 'react';
import { Link,  useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from "../assets/images/logox.webp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"
import { registerRoute } from '../utils/APIRoutes';
const Register = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const toastOption = {
        position: "bottom-right",
         autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
          theme: 'dark'
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const {username,email,password} = values;
            const {data} = await axios.post(registerRoute,{
                username,
                email,
                password
            });
            if(data.status == false){
                toast.error("Error!",toastOption)
            }
            if(data.status == true){
                localStorage.setItem("chat-app-user",JSON.stringify(data.user));
                navigate("/");
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleValidation = () => {
        const { password, confirmPassword, email, username } = values;

        if (!username || !email || !password || !confirmPassword) {
            toast.error("All fields are required", {
                position: "bottom-right",
                autoClose: 3000,
                pauseOnHover: true,
                draggable: true,
                theme: 'dark'
            });
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password must match", toastOption);
            return false;
        }
        else if(username.length<3){
            toast.error("username length must be greater than 3", toastOption);
            return false;
        }
        else if(password.length<8){
            toast.error("password length must be greater than 8", toastOption);
            return false;
        }
        else if(email==""){
            toast.error("Email section must be filled", toastOption);
            return false;
        }

        return true;
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
                        type="email" 
                        placeholder="Email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                    />
                    <button type="submit">Create User</button>
                    <span>Already have an account? <Link to="/login">Login</Link></span>
                </form>
            </FormContainer>
        </>
    );
};

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
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
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border-radius: 6px;
            cursor: pointer;
            border: none;
            font-weight: bold;
            font-size: 1rem;
            width: 100%;
            text-transform: uppercase;
            transition: 0.6s;
        }

        button:hover {
            transform: scale(1.09);
            background-color: #6029f7;
            border-radius: 30px;
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

export default Register;
