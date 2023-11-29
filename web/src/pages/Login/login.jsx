import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import './login.css'
import { GlobalContext } from "../../context/context.mjs";
import { baseURL } from "../../core.mjs";
import { useNavigate } from 'react-router-dom';
import logo from '../../assests/transparent background.png';

const Login = () => {

    let {state, dispatch} = useContext(GlobalContext);
    console.log(state);

    const navigate = useNavigate()
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
        <div id="back">
            <div id="logContainer">
                <h3 className="desktopHandling">Welcome <br/> Back👋</h3>
                <div className="logLog">
                    <img className="logo" src={logo} alt="u-App"/>
                    <h1 className="line"><span className="crimson">U</span> <span className="black">App</span></h1>
                    <p>A Social Media App</p>
                    <p className="leftNav">
                        Don't have an account?
                        <a href="/signup" className="centre">SignUp</a>
                    </p>
                </div>
                <form id="login"className="log login-signup" onSubmit={loginSubmitHandler}>
                    <div id="topHead">
                        <h2 className="centre mobile-handling">
                            Welcome <br /> Back👋
                        </h2>
                    </div>
                    <input type="email" ref={emailRef} id='email' required className="input" placeholder="example@gmail.com" />
                    <input type="password" ref={passwordRef} minLength={4} maxLength={8} className="input" placeholder="Password" id="password" required />
                    <p onClick={() => { navigate('/forget-password') } } className="forget">Forgot Password</p>
                    <p className="alert-message">{alertMessage}</p>
                    <p className="error-message">{errorMessage}</p>
                    <button type="submit" className="button">LOGIN</button>
                    <div className="last">
                        <p className="centre">
                            Don't have an account?
                            <a className="centre" href="/signup">SignUp</a>
                        </p>
                    </div>
                    </form>
                </div>
        </div>
    )
};

export default Login;