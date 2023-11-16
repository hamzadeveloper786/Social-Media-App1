import { useRef, useState } from "react";
import axios from "axios";
import './post.css';
import { baseURL } from "../../core.mjs";

const Post = () =>{

    const postTitleInputRef = useRef(null);
    const postBodyInputRef = useRef(null);
    const postFileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlert, setIsAlert] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [toggleRefresh, setToggleRefresh] = useState(false);

    const submitHandler = async (e)=>{
        e.preventDefault();
        try{
        setIsLoading(true);
        let formData = new FormData();

        formData.append("title", postTitleInputRef.current.value);
        formData.append("text", postBodyInputRef.current.value);
        formData.append("image", postFileInputRef.current.files[0]);
        const response = await axios.post(`${baseURL}/api/v1/post`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
    
          setIsLoading(false);
          console.log(response.data);
          setIsAlert(response.data.message);
          setToggleRefresh(!toggleRefresh);
          setSelectedImage("");
          e.target.reset();
    }
        catch(e){
            console.log(e);
            setIsLoading(false)
            return;
        }
    }

    return(<div id="post-create">
        <fieldset id="post">
        <legend>Create a Post</legend>
        <form onSubmit={submitHandler}>
            <label htmlFor="postTitleInput">Title</label>
            <input type="text" placeholder="Enter Your Title" id="postTitleInput" required minLength={2} maxLength={50} ref={postTitleInputRef}/>
            <br />
            <label htmlFor="postBodyInput">Text</label>
            <textarea id="postBodyInput" required minLength={10} maxLength={999} cols="30" rows="4" placeholder="Write Something in your Mind...." ref={postBodyInputRef}></textarea>
            <br />
            
            <div className="right">
          {selectedImage && <img id="previewImage" src={selectedImage} alt="selected image" />}

        </div>
            <br />
              <input id="postFileInput" type="file" name="postFileInput" ref={postFileInputRef}
                accept="image/*" onChange={(e) => {
                  const base64Url = URL.createObjectURL(e.target.files[0]);
                  setSelectedImage(base64Url)
                }} />
                <br />
            <button type="submit">Publish Post</button>
        </form>
      </fieldset>
      <div className="loader">
      {isAlert && <p className="alert">{isAlert}</p>}
      <br />
      {isLoading ? <div className="spinner-container"><div className="loading-spinner"></div></div> : null}
      </div>
    </div>
    )
};
export default Post;