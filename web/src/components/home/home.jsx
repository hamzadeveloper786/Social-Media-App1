import { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { GlobalContext } from "../../context/context.mjs";
import { HouseFill, PlusCircle, PersonFill ,Arrow90degRight, Chat, Heart, ChatRight } from "react-bootstrap-icons";
import './home.css'
import { useNavigate, Link } from "react-router-dom";
import { baseURL } from '../../core.mjs';
import logo from '../../assests/transparent background.png'

const Home = () => {
    
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [isAlert, setIsAlert] = useState(null);
    const [toggleRefresh, setToggleRefresh] = useState(false);
    const { state, dispatch } = useContext(GlobalContext);

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
              console.log("Posts" ,response.data);
              setIsAlert(response.data.message);
            } catch (error) {
              console.log(error?.data);
            }
          };
          //get profile of exact person
          const getProfile = async (author_id) => {
            navigate(`/profile/${author_id}`);
          };
          //get a single post on another page
          const seePost = async (_id) => {
            navigate(`/post/${_id}`);
          };

    return (<div>
        <div id="logoTop">
                    <img src={logo} alt="u-app"/>
                    <div>
                        <li><Link to={'/user'}><ChatRight></ChatRight></Link></li>
                    </div>
                </div>
                    <nav id='isLogin'>
                        <ul>
                            <li><Link to={'/'}><HouseFill></HouseFill></Link></li>
                            <li><Link to={'/post'}><PlusCircle></PlusCircle></Link></li>
                            <li><Link to={`/profile/${state.user._id}`}><PersonFill></PersonFill></Link></li>
                        </ul>
                    </nav>
        <div id="postTop">
            <span>{ isLoading && <div id="loader"><div className="loading-container"><div className="loading-text"><span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span></div></div></div>}</span>
            {allPosts.map((post, index) => (
                <div key={post._id} className="post-container" >
                    <div>
                    <div id="postN">
                        <div class="profilePic" onClick={() => {getProfile(post.author_id);}}></div>
                        <div id="postPre">
                            <h2>{post.authorObject.firstName} {" "} {post.authorObject.lastName}</h2>
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
                        <div className="button" onClick={()=>{seePost(post._id)}} ><Chat /></div>
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