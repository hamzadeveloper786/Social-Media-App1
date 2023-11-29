import { useState } from "react";
import axios from "axios"

const SingleComment = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);

    const getSinglePost = async () =>{
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/post/:${postId}`, {
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
}
export default SingleComment;