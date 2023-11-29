import axios from "axios";
import moment from "moment";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Arrow90degRight, Chat, Heart} from "react-bootstrap-icons";
import { baseURL } from "../../core.mjs"
import './singleComment.css'

const SingleComment = () => {
    const postId = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [post, setPost] = useState([]);

    const getSinglePost = async () =>{
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/post/${postId.postId}`, {
                withCredentials: true
            });
            console.log(response.data);
            setIsLoading(false);
            setPost(response.data);
        } catch (e) {
            console.log(e.data);
            setIsLoading(false);
        }
        return () => {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getSinglePost();
        return () => { }
    } , []);
    const getProfile = async (author_id) => {
        navigate(`/profile/${author_id}`);
      };

    console.log("Post : ", post)
    return(<div>
 <div className="post-container" >
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
                        <div className="button"><Heart /> ({post?.likes?.length})</div>
                    </div>
                </div>
                <div id="comment">
                    <h4>Comments</h4>
                    <div id="single-comment">
                        <p>Some Comment</p>
                    </div>
                    <form>
                        <input type="text" />
                    </form>
                </div>
                </div>
    </div>

    )
}
export default SingleComment;