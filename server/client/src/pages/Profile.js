import { useEffect, useState } from "react";
import { useUserContext } from "../hooks/useUserContext";

const Profile = () => {
    const {user, dispatch} = useUserContext()
    const [posts, setPosts] = useState([])
    const [image, setImage] = useState('')

    useEffect(() => {
        
        fetch('/getuserposts', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            setPosts(result.userPosts)
        })
    }, [])

    useEffect(() => {
        if(image) {
            const data = new FormData()

            data.append('file', image)
            data.append('upload_preset', 'instaclone')
            data.append('cloud_name', 'djp')

            fetch('https://api.cloudinary.com/v1_1/djp/image/upload', {
                method: 'post',
                body: data
            })
            .then(res => res.json())
            .then(data => {     
                fetch('/updatepicture', {
                    method: 'put',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        picture: data.url
                    })
                }).then(res => res.json())
                .then(result => {
                    localStorage.setItem('user', JSON.stringify({...user, picture: result.picture}))
                    dispatch({type: 'UPDATE_PIC', payload: result.picture})
                })
            })
            .catch(error => console.log(error))
        }
        setImage('')
    }, [image, dispatch, user])

    const updatePicture = (file) => {
        setImage(file)
    }

    return ( 
        <>
        {!user ? <h2>Loading...</h2> :
            <div className="profile">
                <div className="profile-info">
                    <div >
                        <div>
                            <img 
                                src={user ? user.picture : 'Loading...'}
                                alt="no img" 
                                className="profile-pic"
                            />
                        </div>
                        <div className="file-field input-field">
                            <div className="btn #64b5f6 blue darken-1">
                                <span>Update PFP</span>
                                <input type="file"
                                onChange={(e) => updatePicture(e.target.files[0])} 
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4>{user ? user.name: ""}</h4>
                        <div className="profile-stats">
                            <h6>{posts.length} {posts.length !== 1 ? "posts": "post"}</h6>
                            <h6>{user.followers.length} {user.followers.length !== 1 ? "followers": "follower"}</h6>
                            <h6>{user.following.length} Following</h6>
                        </div>
                    </div>
                </div>
                <div className="gallery">
                    {posts &&
                        posts.map(item => {
                            return <img
                                        className="gallery-img" 
                                        key={item._id}
                                        src={item.photo}
                                        alt={item.title} />
                        })
                    }
                </div>
            </div>
        }
        </>
    );
}
 
export default Profile;