import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import './user.css';
import { baseURL } from '../../core.mjs';

const User = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(()=>{
        getAllUsers();
        return () => { }
    }, []);

    //getting users
    const getAllUsers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/users`);
            setIsLoading(false);
            setAllUsers(response.data);
        } catch (e) {
            console.log(e.data);
            setIsLoading(false);
        }
        return () => {
            setIsLoading(false);
        }
    }

    const back = () => {
        navigate(-1);
    }
    //go to chat page
    const seeChat = async (_id) => {
        navigate(`/chat/${_id}`);
      };

    return (
        <div>
            <ArrowLeft id='arrow' onClick={back}></ArrowLeft>
            <div id="use">
            {allUsers.map((user, index) => (
                <div key={index} className="user-container" >
                    <div id="userDiv">
                        <div id="userDetail">
                            <h4 onClick={()=>{seeChat(user._id)}}>{user.firstName} {" "} {" "} {user.lastName}</h4>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    )
}

export default User;