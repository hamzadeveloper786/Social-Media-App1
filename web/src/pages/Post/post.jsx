import { useRef, useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChatRight, HouseFill, PersonFill, PlusCircle } from "react-bootstrap-icons";
import { GlobalContext } from "../../context/context.mjs";
import './post.css';
import logo from "../../assests/transparent background.png";
import { baseURL } from "../../core.mjs";

const Post = () =>{

  const postTitleInputRef = useRef(null);
    const postBodyInputRef = useRef(null);
    const postFileInputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlert, setIsAlert] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [toggleRefresh, setToggleRefresh] = useState(false);
    let { state, dispatch } = useContext(GlobalContext);
    
    useEffect(()=>{
      setTimeout(()=>{
          setIsAlert("");
      },5000);
  });

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

    return(<div id="postDiv">
      <div id="logoTop">
                    <img src={logo} alt="u-app"/>
                    <div>
                        <li><Link to={'/chat'}><ChatRight></ChatRight></Link></li>
                    </div>
                </div>
                    <nav id='isLogin'>
                        <ul>
                            <li><Link to={'/'}><HouseFill></HouseFill></Link></li>
                            <li><Link to={'/post'}><PlusCircle></PlusCircle></Link></li>
                            <li><Link to={`/profile/${state.user._id}`}><PersonFill></PersonFill></Link></li>
                        </ul>
                    </nav>
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
            <p>Upload file does not work on production mode.</p>
              <input id="postFileInput" type="file" name="postFileInput" ref={postFileInputRef}
                accept="image/*" onChange={(e) => {
                  const base64Url = URL.createObjectURL(e.target.files[0]);
                  setSelectedImage(base64Url)
                }} />
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