import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import './home.css'
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../core.mjs';
import { Arrow90degRight, Chat, Heart } from "react-bootstrap-icons";

const Home = () => {
    
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [isAlert, setIsAlert] = useState(null);
    const [toggleRefresh, setToggleRefresh] = useState(false);

    const getAllPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/feeds`, {
                withCredentials: true
            });
            console.log(response.data);
            setIsLoading(false);
            setAllPosts(response.data);
        } catch (e) {
            console.log(e.data);
            setIsLoading(false);
        }
        return () => {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getAllPosts();
        return () => { }
    }
        , [toggleRefresh]);

        const doLikeHandler = async (_id) => {
            try {
              const response = await axios.post(`${baseURL}/api/v1/post/${_id}/dolike`);
              console.log(response.data);
              setIsAlert(response.data.message);
            } catch (error) {
              console.log(error?.data);
            }
          };
          const getProfile = async (author_id) => {
            navigate(`/profile/${author_id}`);
          };

    return (<div>
        <div id="postTop">
            <span>{isLoading && <div id="loader"><div className="loading-container"><div className="loading-text"><span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span></div></div></div>}</span>
            {allPosts.map((post, index) => (
                <div key={post._id} className="post-container" >
                    <div>
                    <div id="postN">
                        <div class="profilePic" onClick={() => {getProfile(post.author_id);}}></div>
                        <div id="postPre">
                            <h2>{post.author}</h2>
                            <span id="time">{moment(post.createdAt).fromNow()}</span>
                            <h4>{post.title}</h4>
                            <p>{post.text}</p>
                            {post.img &&
                  <>
                    <img src={post.img} alt="post image" />
                  </>
                }
                        </div>
                    </div>
                    <div className="postFooter">
                        <div className="button"><Chat /></div>
                        <div className="button"><Arrow90degRight /></div>
                        <div className="button"onClick={(e) => {doLikeHandler(post._id);}}><Heart /> ({post?.likes?.length})</div>
                    </div>
                </div>
                </div>
            ))}
            <br />
        </div>
    </div>
    );

}

export default Home;