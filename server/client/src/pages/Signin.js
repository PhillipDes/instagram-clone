import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useUserContext} from '../hooks/useUserContext'
import M from 'materialize-css'

const Signin = () => {
    const {dispatch} = useUserContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const sumbitSignin = (e) => {
        e.preventDefault()

        setIsLoading(true)
        const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if(!validEmail.test(email)) {
            setIsLoading(false)
            return M.toast({html: 'Invalid email', classes: "#c62828 red darken-3"})
        }
        fetch('/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email,
                password
             })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                setIsLoading(false)
                M.toast({html: data.error, classes: "#c62828 red darken-3"})
            }
            else {
                localStorage.setItem('jwt', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))
                setIsLoading(false)
                dispatch({type:'USER', payload: data.user})
                M.toast({html: "Sign in successful", classes:"#66bb6a green lighten-1"})
                navigate('/')
            }
        })
        .catch(error => console.log(error))
    }

    return (  
        <form onSubmit={sumbitSignin}>
            <div className="mycard">
                <div className="card auth-card input-field">
                    <h2 className='brand-logo'>InstaClone</h2> 
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
                    <button 
                        className="btn waves-effect waves-light #64b5f6 blue darken-1"
                        disabled= {isLoading}
                    >Sign in
                    </button>
                    <h5>
                        <Link to='/signup' >Don't have an account?</Link>
                    </h5>
                    <h6>
                        <Link to='/reset' >Forgot password?</Link>
                    </h6>
                </div>
            </div>
        </form>
    );
}
 
export default Signin;