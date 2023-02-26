import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if(url) {
            fetch('/createpost', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: url
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data.error) {
                    M.toast({html: data.error, classes: "#c62828 red darken-3"})
                }
                else {
                    M.toast({html: "Post created", classes:"#66bb6a green lighten-1"})
                    navigate('/')
                }
            })
            .catch(error => console.log(error))
        }
    }, [url, body, navigate, title])

    const postDetails = (e) => {
        e.preventDefault()
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
            setUrl(data.url)
        })
        .catch(error => console.log(error)) 
    }


    return (  
        <div className="card input-filed create-card">
            <form onSubmit={postDetails}>
                <input 
                    type="text" 
                    placeholder="Title"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    /> 
                <input 
                    type="text" 
                    placeholder="Body" 
                    value={body} 
                    onChange={(e) => setBody(e.target.value)} 
                    />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file"
                        onChange={(e) => setImage(e.target.files[0])} 
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1">
                    Submit Post
                </button>
            </form>
        </div>
    );
}
 
export default CreatePost;