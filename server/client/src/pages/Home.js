import { useEffect, useState } from "react";

//components
import Post from "../components/Post";

const Home = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('/getallposts', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
        .then(result => {
            setData(result.posts)
        })
    }, [])

    return (
        <div className="home">
            {data && (data.map(item => {
                return (
                    <Post key={item._id} item= {item} data={data} setData= {setData} />
                )
            }))}
            
        </div>
    );
}
 
export default Home;