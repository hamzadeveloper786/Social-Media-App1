import { useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { GlobalContext } from './context/context.mjs';
import axios from 'axios';
import Home from './components/home/home';
import Post from './pages/Post/post';
import Profile from './pages/Profile/profile'
import Login from './pages/Login/login';
import SignUp from './pages/Signup/signup';
import Chat from './pages/Chat/chat.jsx';
import ForgetPassword from './pages/Forget-Password/forget-pass.jsx';
import SingleComment from './pages/SingleComment/SingleComment.jsx';
import splash from '../src/assests/splash.gif';
import './App.css';
import { baseURL } from './core.mjs'


const App = () => {

    const { state, dispatch } = useContext(GlobalContext);

    useEffect(() => {
        // Add a request interceptor
        axios.interceptors.request.use(function (config) {
            config.withCredentials= true;
            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });

    }, [])

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await axios.get(`${baseURL}/api/v1/profile`, {
                    withCredentials: true
                });
                dispatch({
                    type: "USER_LOGIN",
                    payload: res.data.data,
                })
            }
            catch (e) {
                dispatch({
                    type: "USER_LOGOUT",
                })
                console.log(e);
            }
        }
        checkLoginStatus();
    },[]);
    return (
        <div>
            {state.isLogin === true ? (
                <>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path="profile/:userId" element={<Profile />} />
                        <Route path="post" element={<Post />} />
                        <Route path="post/:postId" element={<SingleComment />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path='*' element={<Navigate to='/' />} />
                    </Routes>
                </>
            ) : (
                null
            )}

            {state.isLogin === false ? (<Routes>
                <Route path='/signup' element={<SignUp />} />
                <Route path='/login' element={<Login />} />
                <Route path='forget-password' element={<ForgetPassword />} />
                <Route path='*' element={<Navigate to='/login' />} />
            </Routes>) : null}

            {/* splash screen */}
            {state.isLogin === null ? (
                <img src={splash} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }} alt="splash screen" />
            ) : null}
        </div>
    );
};

export default App;