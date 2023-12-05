import { useEffect, useRef, useState, useContext } from 'react';
import axios from 'axios';
import { ArrowLeft, PlusLg, Send } from 'react-bootstrap-icons';
import { useParams, useNavigate } from 'react-router-dom';
import './chat.css';
import { baseURL } from '../../core.mjs';
import { GlobalContext } from '../../context/context.mjs';
const Chat = () => {

    let {state, dispatch} = useContext(GlobalContext);
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
    //send message 
    const sendMessageHandler = async (event) => {
        event.preventDefault();
        console.log(message.current.value);

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
            console.log(response.data);
            event.target.reset();
        } catch (error) {
            // handle error
            console.log(error?.data);
            setIsLoading(false);
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
    }, [])
    //back to previous page
    const back = () => {
        navigate(-1);
    }
    return (
        <div id='chat'>
            <div id="header">
                <ArrowLeft id='arrow' onClick={back}></ArrowLeft>
                <h1>{profile?.data?.firstName} {" "} {profile?.data?.lastName} </h1>
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