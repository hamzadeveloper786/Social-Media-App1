import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import './login.css'
import { GlobalContext } from "../../context/context.mjs";
import { baseURL } from "../../core.mjs";

const Login = () => {

    let {state, dispatch} = useContext(GlobalContext);
    console.log(state);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        setTimeout(()=>{
            setAlertMessage("");
            setErrorMessage("");
        },5000);
    });

    const loginSubmitHandler = async(e) =>{
        e.preventDefault();
        console.log("Login");

        try{
        const response =await axios.post(`${baseURL}/api/v1/login`,{
            email: emailRef.current.value,
            password: passwordRef.current.value,
        },{
            withCredentials: true
        });
        dispatch({
            type: "USER_LOGIN",
            payload: response.data.data,
        })
        console.log(response?.data?.message);
        setAlertMessage(response?.data?.message);
    }catch(e){
            console.log(e);
            setErrorMessage(e?.response?.data?.message);
        }
    }
    

    return (
        <div>
            <div id="container" className="p-4 mt-5">
                <h3 className="text-left text-2xl mb-4 mt-4 ml-2 ">LOGIN</h3>
                <form id="login" onSubmit={loginSubmitHandler}>
                    <label className="text-left ml-2" htmlFor="email">Email:</label>
                    
                    <input type="email" ref={emailRef} id='email' required autoComplete="email" />
                    <br />
                    <label htmlFor="password" className="text-left ml-2">Password:</label>
                    <input type="password" ref={passwordRef} minLength={4} maxLength={8} id="password" required autoComplete="current-password" />
                    <br />

                    <button type="submit">LOGIN</button>
                    <ul id="navSign">
                        <p>
                        Not a Member 
                        </p>
                    <li><Link to='/signup'>SIGNUUP</Link></li>
                    </ul>
                </form><br />
                <div className='alert-message'>{alertMessage}</div>
                <div className='error-message'>{errorMessage}</div>
            </div>
        </div>
    )
};
export default Login;