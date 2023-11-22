import { useContext, useEffect, useState, useRef } from "react";
import { GlobalContext } from "../../context/context.mjs";
import axios from "axios";
import moment from "moment";
import { BoxArrowLeft, Trash, PencilSquare, Arrow90degRight, Chat, Heart} from "react-bootstrap-icons";
import { baseURL } from '../../core.mjs';
import Swal from "sweetalert2";
import './profile.css'
import { useParams } from "react-router-dom";

const Profile = () =>{
    let {state, dispatch} = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [profile, setProfile] = useState(null);
    const [toggleRefresh, setToggleRefresh] = useState(false);
    let { userId } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef();

    const getAllPosts = async () => {

        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/user/posts?_id=${userId || ""}`, {
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
    const getProfile = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${baseURL}/api/v1/profile/${userId || ""}`);
            console.log(response.data);
            setIsLoading(false);
            setProfile(response.data);
        } catch (e) {
            console.log(e.data);
            setIsLoading(false);
        }
    }
    useEffect(() => {
        getAllPosts();
        getProfile();
        return () => { }
    }
        , [toggleRefresh]);

    const logoutHandler = async () =>{
        try{
            await axios.post(`${baseURL}/api/v1/logout` , {} , {
                withCredentials: true
            });
            dispatch({
                type: "USER_LOGOUT",
            });
        }catch(e){
            console.log(e);
        }
    }
    const deletePostHandler = async (_id) => {
        try {
            setIsLoading(true);
            const response = await axios.delete(`${baseURL}/api/v1/post/${_id}`);

            setIsLoading(false);
            console.log(response.data);
            setToggleRefresh(!toggleRefresh);
        } catch (error) {
            // handle error
            console.log(error?.data);
            setIsLoading(false);
        }
    };

    const editPost = async (e) => {
        e.preventDefault();
        const _id = e.target.children[0].value;
        const title = e.target.children[1].value;
        const text = e.target.children[2].value;
        try {
            setIsLoading(true);
            const response = await axios.put(`${baseURL}/api/v1/post/${_id}`, {
                title: title,
                text: text
            });

            setIsLoading(false);
            console.log(response.data);
            setToggleRefresh(!toggleRefresh);
        } catch (e) {
            console.log(e);
            setIsLoading(false);
            return;

        }
    }

    if (selectedImage) {
        Swal.fire({
          title: "Edit profile picture",
          html: `
            <img src="${selectedImage}" class="profileImageSelect" />
          `,
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: "Cancel",
          confirmButtonText: "Upload",
          cancelButtonColor: "#284352",
          confirmButtonColor: "#284352",
        }).then((result) => {
          if (result.isConfirmed) {
            let formData = new FormData();
    
            formData.append("profileImage", fileInputRef.current.files[0]);
            formData.append("userId", state.user.userId);
    
            Swal.fire({
              title: `<span class="loader"></span>`,
              text: "Uploading...please don't cancel",
              allowOutsideClick: false,
              showConfirmButton: false,
              onBeforeOpen: () => {
                Swal.showLoading();
              },
            });
    
            axios
              .post(`${baseURL}/api/v1/profilePicture`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              })
              .then(function (response) {
                // console.log(response.data);
                const Toast = Swal.mixin({
                  toast: true,
                  position: "top-end",
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                  },
                });
                Toast.fire({
                  // icon: "success",
                  title: "Profile picture updated",
                });
              })
              .catch(function (error) {
                console.log(error);
                Swal.fire({
                  // icon:"error",
                  title: "Can't update profile picture",
                  timer: 2000,
                  showConfirmButton: false,
                  showCancelButton: true,
                  cancelButtonColorL: "#284352",
                  cancelButtonText: "Ok",
                });
              });
    
            setSelectedImage("");
          }
        });
      }

    console.log("state ", state)
    return(
       <div id="top">
        <div className="info">
        {/* {profile === "noUser" ? (
        <div className="noUser">No User Found</div>
      ) : (
        <>
          <div className="profile">
            <img
              className="profileIMG"
              src={profile.profileImage}
              onClick={seePic}
            /> */}
{/* 
            <h2 className="profileName">
              {profile.firstName} {profile.lastName}
              {state.user.userId === profile.userId ? (
                <PencilFill
                  onClick={changeName}
                  style={{ fontSize: "0.5em" }}
                  className="pencil"
                />
              ) : null}
            </h2> */}
            <h3>{(profile?.data?.firstName)} {(profile?.data?.lastName)}</h3>
            <div className="dropdown" id="dropDown">
            <button className="drop-down" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <p id="p" className="bi bi-three-dots-vertical dots"></p>
            </button>
            <ul className="dropdown-menu">
                <li className="list"><button onClick={logoutHandler}><BoxArrowLeft/> LOGOUT</button></li>
            </ul>
        </div>
        </div>
        {allPosts.map((post, index) => (
                <div key={post._id} className="post-container" >
                     {(post.isEdit) ?
                        <form id="editForm" onSubmit={editPost}>
                            <input type="text" disabled hidden value={post._id} />
                            <input type="text" defaultValue={post.title} />
                            <textarea defaultValue={post.text} cols="30" rows="4"></textarea>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => {
                                post.isEdit = false;
                                setAllPosts([...allPosts]);
                            }} >Cancel</button>
                            <span>{isLoading && <div className="spinner-container"><div className="loading-spinner"></div></div>}</span>
                        </form> :
                        <div>
                            <div className="dropdown" id="dropDown">
    <button className="drop-down" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <p className="bi bi-three-dots-vertical dots"></p>
    </button>
    <ul className="dropdown-menu">
        <li className="list"><button type="button" onClick={() => {
            post.isEdit = true;
            setAllPosts([...allPosts]);
        }}><PencilSquare /> Edit</button></li>
        <li className="list"><button type="button" onClick={(e) => {
            deletePostHandler(post._id);
        }}><Trash /> Delete</button></li>
    </ul>
</div>
                        <div id="postN">
                            <div id="profilePic"></div>
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
                    }
       </div>))}
       </div>
    )
}

export default Profile;