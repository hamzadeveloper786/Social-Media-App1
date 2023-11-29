import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../core.mjs';
import logo from '../../assests/transparent background.png'
import './signup.css';

const SignUp = () => {

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState("hidden");

    useEffect(() => {
        setTimeout(() => {
            setAlertMessage("");
            setErrorMessage("");
        }, 5000);

    }, [alertMessage, errorMessage])

    const signUpHandler = async (e) => {
        e.preventDefault();
        console.log("Sign Up");
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            setPasswordError("");
            return;
        } else {
            setPasswordError("hidden");
        }

        try {
            const response = await axios.post(`${baseURL}/api/v1/signup`, {
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
            })
            console.log(response.data.message);
            setAlertMessage(response.data.message);
        } catch (e) {
            console.log(e);
            setErrorMessage(e.response.data.message);
        }
    }

    return (
        <div id="back">
            <div id="logContainer">
                <h3 className="desktopHandling">Welcome <br /> Back🙂</h3>
                <div className="logLog">
                    <img className="logo" src={logo} alt="u-App" />
                    <h1 className="line"><span className="crimson">U</span> <span className="black">App</span></h1>
                    <p>A Social Media App</p>
                    <p className="leftNav">
                        Already have an Account?
                        <a href="/login" className="centre">Login</a>
                    </p>
                </div>
                <form id="login" className="log login-signup" onSubmit={signUpHandler}>
                    <div id="topHead">
                        <h2 className="centre mobile-handling">
                            Welcome <br /> Back🙂
                        </h2>
                    </div>
                    <input ref={firstNameRef} type="text" id="firstName" className='input' autoComplete='given-name' required placeholder='First Name' />
                    <input type="text" ref={lastNameRef} id="lastName" required autoComplete='family-name' className='input' placeholder='Last Name' />
                    <input type="email" ref={emailRef} id='email' required className="input" placeholder="example@gmail.com" autoComplete='email' />
                    <input type="password" ref={passwordRef} minLength={4} maxLength={8} className="input" placeholder="Password" id="password" required />
                    <input type="password" ref={confirmPasswordRef} className='input' id="confirmPassword" required autoComplete='new-password' placeholder='Confirm Password' />
                    <p className={`error-message ${passwordError}`}>Password doesn't match!</p>
                    <p className="alert-message">{alertMessage}</p>
                    <p className="error-message">{errorMessage}</p>
                    <button type="submit" className="button">SignUp</button>
                    <div className="last">
                        <p className="centre">
                            Already have an account?
                            <a className="centre" href="/login">Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default SignUp;