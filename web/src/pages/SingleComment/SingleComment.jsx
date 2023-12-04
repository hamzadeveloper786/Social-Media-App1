import { useState } from "react";
import axios from "axios"
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { Arrow90degRight, Chat, Heart, ArrowLeft } from "react-bootstrap-icons";
import { baseURL } from "../../core.mjs";
import { useEffect } from "react";

const SingleComment = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [post, setpost] = useState([]);
    const navigate = useNavigate();
    const postId = useParams().postId;

    const getSinglePost = async () =>{
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/post/${postId}`, {
                withCredentials: true
            });
            console.log(response.data);
            setIsLoading(false);
            setpost(response.data);
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
    } ,[])
    //getting profile function 
    const getProfile = async (author_id) => {
        navigate(`/profile/${author_id}`);
      };

      //do like function
      const doLikeHandler = async (_id) => {
        try {
          const response = await axios.post(`${baseURL}/api/v1/post/${postId}/dolike`);
          console.log("Posts" ,response.data);
        } catch (error) {
          console.log(error?.data);
        }
      }
      //back function
      const back = () => {
        navigate(-1);
    }
    return(
        <div>
             <ArrowLeft id='arrow' onClick={back}></ArrowLeft>
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
                        <div className="button"onClick={(e) => {doLikeHandler(post._id);}}><Heart /> ({post?.likes?.length})</div>
                    </div>
                </div>
                </div>
                </div>
    )
}
export default SingleComment;