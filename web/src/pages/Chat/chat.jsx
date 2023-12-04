import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, PlusLg, Send } from 'react-bootstrap-icons';
import { useParams, useNavigate } from 'react-router-dom';
import './chat.css';
import { baseURL } from '../../core.mjs';
const Chat = ()=>{

    const navigate = useNavigate();
    const userId = useParams().userId;
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
    useEffect(() => {
        getProfile();
        return () => { }
    },[])
    //back to previous page
    const back = () => {
        navigate(-1);
    }
    return(
        <div id='chat'>
            <div id="header">
                <ArrowLeft id='arrow' onClick={back}></ArrowLeft>
                    <h1>{profile?.data?.firstName} {" "} {profile?.data?.lastName} </h1>
                </div>
            <div id='messages'>
               
            <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message2</div>
               <div className='my'>Some Message1</div>
               <div className='you'>Some Message</div>
            </div>
            <div id="form">
                <form>
                    <label htmlFor="file"><PlusLg></PlusLg></label>
                    <input type="file" style={{display: 'none'}} name="file" id="file" accept="image/*" />
                    <input type="text" name="send" id="send" placeholder='Type a Message...'/>
                    <button type="submit"><Send/></button>
                </form>
            </div>
        </div>
    )
}
export default Chat;