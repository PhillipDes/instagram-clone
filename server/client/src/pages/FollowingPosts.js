import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {useUserContext} from '../hooks/useUserContext'

//components
import Post from "../components/Post";

const FollowingPosts = () => {
    const [data, setData] = useState([])
    const {user} = useUserContext()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/getfollowposts', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            setData(result.posts)
        })
        setIsLoading(false)
    }, [])

    return (
        <>
        {isLoading ? <h2>Loading...</h2> :
            !user ?  <Link to='/signin'><h2>Sign in to see following posts</h2></Link> :
                <div className="home">
                    {data && (data.map(item => {
                        return (
                            <Post item= {item} data={data} setData= {setData} />
                        )
                    }))}  
                </div>
            
        }
        </>
    );
}
 
export default FollowingPosts;