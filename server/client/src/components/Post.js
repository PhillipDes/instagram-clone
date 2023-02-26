import { useState } from "react";
import { Link } from "react-router-dom";
import {useUserContext} from '../hooks/useUserContext'

//functions
import { likePost, unlikePost, makeComment, deletePost, deleteComment } from "../functions/postFunctions";

const Post = ({item, data, setData}) => {
    const {user} = useUserContext()
    const [isLiking, setIsLiking] = useState(false)

    return (  
        <div className="home-card card">
            <h5>
                <Link to={item.postedBy._id !== user._id ? "/profile/" + item.postedBy._id : "/profile/"} >
                    {item.postedBy.name}
                </Link>
                {item.postedBy._id === user._id &&
                    <i 
                        style={{float: 'right'}} 
                        className="material-icons" 
                        onClick={() => deletePost(item._id, data, setData)}>delete
                    </i>
                }   
            </h5>
            <div className="card-image">
                <img 
                    src={item.photo}
                    alt="no img" />
            </div>
            <div className="card-content">
                <i 
                    className="material-icons" 
                    style={{color:'red'}} 
                    onClick={item.likes.includes(user._id) ? () => unlikePost(item._id, isLiking, setIsLiking, data, setData) :
                        () => likePost(item._id, isLiking, setIsLiking, data, setData)}
                >
                    {!item.likes.includes(user._id) ? 'favorite_outline' : 'favorite'}
                </i>
                <h6>{item.likes.length} Likes</h6> 
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map(record => {
                    return (
                        <h6 key={record._id}><span style={{fontWeight: "500"}}>{record.postedBy.name}</span> {record.text}
                        {record.postedBy._id === user._id &&
                            <i 
                                className="material-icons" 
                                onClick={() => deleteComment(item._id, record._id, data, setData)}>delete
                            </i>
                        } 
                        </h6>
                    )
                })}
                <form onSubmit={(e) => {
                    e.preventDefault()
                    makeComment(e.target[0].value, item._id, data, setData)
                    document.getElementById(`comment ${item._id}`).value = ''
                }}>
                    <input id= {`comment ${item._id}`} type="text" placeholder="Add a comment" autoComplete="off" />
                </form>                           
            </div>
        </div>    
    )
}
 
export default Post;