import './forget-pass.css'
import logo from '../../assests/transparent background.png';

const forgotPassword = () => {
    
    return (
        <div id="back">
            <div id="logContainer">
                <h3 className="desktopHandling">Welcome <br/> Back👋</h3>
                <div className="logLog">
                    <img className="logo" src={logo} alt="u-App"/>
                    <h1 className="line"><span className="crimson">U</span> <span className="black">App</span></h1>
                    <p>A Social Media App</p>
                    <p className="leftNav">
                        <a href="/login" className="centre">Login</a>
                        <a href="/signup" className="centre">SignUp</a>
                    </p>
                </div>
                <form id="login"className="log login-signup">
                    <div id="topHead">
                        <h2 className="centre mobile-handling">
                            Forgot <br /> Password
                        </h2>
                    </div>
                    <input type="email" id='email' required className="input" placeholder="example@gmail.com" />
                    <p className='pass'>Forgot Password is Under Construction</p>
                    <button type="submit" className="button">Next</button>
                    <div className="last">
                        <p className="centre">
                            <a className="centre" href="/login">Login</a>
                            <a className="centre" href="/signup">SignUp</a>
                        </p>
                    </div>
                    </form>
                </div>
        </div>
    )
};

export default forgotPassword;