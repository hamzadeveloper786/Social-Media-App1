import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../core.mjs';
import './signup.css';

const SignUp = () =>{

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("hidden");

    useEffect(()=>{
        setTimeout(()=>{
            setAlertMessage("");
            setErrorMessage("");
        },5000);

    },[alertMessage, errorMessage])

    const signUpHandler = async(e) =>{
        e.preventDefault();
        console.log("Sign Up");
        if (passwordRef.current.value !== confirmPasswordRef.current.value){
            setPasswordError("");
            return;
        }else{
            setPasswordError("hidden");
        }

        try{
        const response =await axios.post(`${baseURL}/api/v1/signup`,{
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        })
        console.log(response.data.message);
        setAlertMessage(response.data.message);
    }catch(e){
            console.log(e);
            setErrorMessage(e.response.data.message);
        }
    }
    
    return(
        <div>
            <div id="container" className="p-4 mt-5">
                <h3 className="text-left text-2xl mb-4 mt-4 ml-2 ">Create an Account!</h3>
                <form id="login" onSubmit={signUpHandler}>
                    <label className="text-left ml-2" htmlFor="firstName">First Name:</label>
                    <input ref={firstNameRef} type="text" id="firstName" autoComplete='given-name' required />
                    <br />
                    <label className="text-left ml-2" htmlFor="lastName">Last Name:</label>
                    <input type="text" ref={lastNameRef} id="lastName" required autoComplete='family-name' />
                    <br />
                    <label className="text-left ml-2" htmlFor="email">Email:</label>
                    <input type="email" ref={emailRef} id='email' required autoComplete='email' />
                    <br />
                    <label className="text-left ml-2" htmlFor="password">Password:</label>
                    <input type="password" ref={passwordRef} id="password" required autoComplete='new-password' />
                    <br />
                    <label className="text-left ml-2" htmlFor="password">Confirm Password:</label>
                    <input type="password" ref={confirmPasswordRef} id="confirmPassword" required autoComplete='new-password' />
                    <p className={`error-message ${passwordError}`}>Password doesn't match!</p>
                    <br />
                    <button type="submit">Sign Up</button>
                    <ul id="navSign">
                        <p>
                        Already a Member! 
                        </p>
                    <li><Link to='/login'>LOGIN</Link></li>
                    </ul>
                </form>
                <br />
                <div className='alert-message'>{alertMessage}</div>
                <div className='error-message'>{errorMessage}</div>
            </div>
            <br />
        </div>
    )
};
export default SignUp;