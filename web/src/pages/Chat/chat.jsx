import { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { ArrowLeft, PlusLg, Send } from 'react-bootstrap-icons';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import './chat.css';
import { baseURL } from '../../core.mjs';
import { GlobalContext } from '../../context/context.mjs';
const Chat = () => {

    let {state, dispatch} = useContext(GlobalContext);
    useEffect(()=>{
        const socket = io(baseURL,{
            secure: true,
            withCredentials: true,
        });
        socket.on('connect', ()=>{
            console.log("connected");
        });
        socket.on('disconnect', (message)=>{
            console.log("Socket disconnected from Server", message);
        });
        socket.on("New_Message", (e)=>{
            setChat((prev)=>{
                return[e, ...prev];
            });
        })
        return () => {
            socket.close();
                socket.disconnect();
        }
    },[])
    const navigate = useNavigate();
    const [chat, setChat] = useState([]);
    const userId = useParams().userId;
    const message = useRef();
    const [toggleRefresh, setToggleRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState({});

    //fetch profile
    const getProfile = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/v1/profile/${userId || ""}`);
            console.log(response.data);
            setProfile(response.data);
        } catch (e) {
            console.log(e.data);
        }
    }
    //get messages
    const getChat = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/messages/${userId}`);
            console.log(response.data);

            setIsLoading(false);
            setChat([...response.data]);
        } catch (error) {
            console.log(error.data);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getProfile();
        getChat();
        return () => { }
    },[toggleRefresh])
    //send message 
    const sendMessageHandler = async (event) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            let formData = new FormData();

            formData.append("to_id", userId);
            formData.append("message", message.current.value);
            // formData.append("image", aaa.current.files[0]);

            const response = await axios.post(
                `${baseURL}/api/v1/message`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            setIsLoading(false);
            setToggleRefresh(!toggleRefresh);
            event.target.reset();
        } catch (error) {
            // handle error
            console.log(error?.data);
            setIsLoading(false);
        }
    }
    //back to previous page
    const back = () => {
        navigate(-1);
    }
    return (
        <div id='chat'>
            <div id="header">
                <ArrowLeft id='arrow' onClick={back}></ArrowLeft>
                <h1>{profile?.data?.firstName} {" "} {profile?.data?.lastName} </h1><br />
                <span>Realtime is Under Construction</span>
            </div>
            <div id='messages'>
                {chat.map((eachMessage, index) => (

                    <div className={`chatBaloon ${(eachMessage.from_id === state.user._id) ? "my" : "you"}`}>
                        {eachMessage.messageText}
                    </div>
                ))}

            </div>
            <div id="form">
                <form onSubmit={sendMessageHandler}>
                    <label htmlFor="file"><PlusLg></PlusLg></label>
                    <input type="file" style={{ display: 'none' }} name="file" id="file" accept="image/*" />
                    <input ref={message} type="text" name="send" id="send" placeholder='Type a Message...' />
                    <button type="submit"><Send /></button>
                </form>
            </div>
        </div>
    )
}
export default Chat;