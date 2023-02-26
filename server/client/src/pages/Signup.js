import { useState, useEffect } from 'react'
import {useUserContext} from '../hooks/useUserContext'
import {Link, useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    const {dispatch} = useUserContext()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if(url) {
            uploadInfo()
        }
    }, [url])

    const uploadPicture = () => {
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

    const uploadInfo = () => {
        setIsLoading(true)

        const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if(!validEmail.test(email)) {
            setIsLoading(false)
            return M.toast({html: 'Invalid email', classes: "#c62828 red darken-3"})
        }
        fetch('/signup', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                email,
                password,
                picture: url
             })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                setIsLoading(false)
                M.toast({html: data.error, classes: "#c62828 red darken-3"})
            }
            else {
                console.log(data)
                localStorage.setItem('jwt', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                dispatch({type:'USER', payload: data.user})
                setIsLoading(false)
                M.toast({html: 'Sign in Successful', classes:"#66bb6a green lighten-1"})
                navigate('/')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    const sumbitSignup = (e) => {
        e.preventDefault()

        if(image) {
            uploadPicture()
        } else {
            uploadInfo()
        }
    }

    return (  
        <form onSubmit={sumbitSignup}>
            <div className="mycard">
                <div className="card auth-card input-field">
                    <h2 className='brand-logo'>InstaClone</h2> 
                    <input 
                        type="text" 
                        placeholder="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} />
                    <input 
                        type="text" 
                        placeholder="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} />
                    <input 
                        type="password" 
                        placeholder="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                    <div className="file-field input-field">
                        <div className="btn #64b5f6 blue darken-1">
                            <span>Add PFP</span>
                            <input type="file"
                            onChange={(e) => setImage(e.target.files[0])} 
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <button 
                        className="btn waves-effect waves-light #64b5f6 blue darken-1"
                        disabled={isLoading}
                    >Sign up
                    </button>
                    <h5>
                        <Link to='/signin' >Already have an account?</Link>
                    </h5>
                </div>
            </div>
        </form>
    );
}
 
export default Signup;