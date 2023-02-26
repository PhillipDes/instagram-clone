import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";

const UserProfile = () => {
    const {user, dispatch} = useUserContext()
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {userid} = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        fetch(`/getuser/${userid}`
            // , {
            // headers: {
            //     'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            // }}
            ).then(res => res.json())
        .then(result => {
            setProfile(result)
        })

    }, [userid, user])

    const followUser = () => {
        if(!user) {
            navigate('/signin')
        }

        setIsLoading(true)

        fetch('/follow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
        .then(data => {
            dispatch({type: 'UPDATE', payload: {following: data.following, followers: data.followers}})
            localStorage.setItem('user', JSON.stringify(data))
            setIsLoading(false)
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id]
                    }
                }
            })
            
        })
    }
    
    const unfollowUser = () => {
        setIsLoading(true)

        fetch('/unfollow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
        .then(data => {
            dispatch({type: 'UPDATE', payload: {following: data.following, followers: data.followers}})
            localStorage.setItem('user', JSON.stringify(data))
            setIsLoading(false)
            setProfile((prevState) => {
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers.filter(item => item !== data._id)]
                    }
                }
            })
        })
        
    }

    return ( 
        <>
        {!profile ? <h2>Loading...</h2> :
            <div className="profile">
                <div className="profile-info">
                    <div>
                        <img 
                            src={profile.user.picture} 
                            alt="no img" 
                            className="profile-pic" 
                            style={{width:'160px'}}/>
                    </div>
                    <div>
                        <h4>{profile.user.name}</h4>
                        <div className="profile-stats">
                            <h6>{profile.posts.length} {profile.posts.length !== 1 ? "posts": "post"}</h6>
                            <h6>{profile.user.followers.length} {profile.user.followers.length !== 1 ? "followers": "follower"}</h6>
                            <h6>{profile.user.following.length} following</h6>
                        </div>
                        <button 
                            className="btn waves-effect waves-light #64b5f6 blue darken-1 follow-button"
                            onClick= {user && profile.user.followers.includes(user._id) ? unfollowUser : followUser}
                            disabled= {isLoading}
                        >{user && profile.user.followers.includes(user._id) ? 'Unfollow' : 'Follow'}
                        </button>
                    </div>
                </div>
                <div className="gallery">
                    {profile &&
                        profile.posts.map(item => {
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
 
export default UserProfile;