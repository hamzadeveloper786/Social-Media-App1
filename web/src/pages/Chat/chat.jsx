import React from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import './chat.css';

const Chat = () => {
    const navigate = useNavigate();

    const back = () => {
        navigate(-1);
    }

    return (
        <div>
            <ArrowLeft id='arrow' onClick={back}></ArrowLeft>
            <div id='chat'>
                <h1>Chat</h1>
                <p>Chat is Under Construction!</p>
            </div>
        </div>
    )
}

export default Chat;