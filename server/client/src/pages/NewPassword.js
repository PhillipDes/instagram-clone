import { useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import M from 'materialize-css'

const NewPassword = () => {
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const {token} = useParams()
    const navigate = useNavigate()

    const sumbitReset = (e) => {
        e.preventDefault()

        setIsLoading(true)
        
        fetch('/updatepassword', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                password,
                token
             })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                setIsLoading(false)
                M.toast({html: data.error, classes: "#c62828 red darken-3"})
            }
            else {
                setIsLoading(false)
                M.toast({html: data.message, classes:"#66bb6a green lighten-1"})
                navigate('/signin')
            }
        })
        .catch(error => console.log(error))
    }

    return (  
        <form onSubmit={sumbitReset}>
            <div className="mycard">
                <div className="card auth-card input-field">
                    <h2 className='brand-logo'>InstaClone</h2> 
                    <input 
                        type="password" 
                        placeholder="enter new password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} />
                    <button 
                        className="btn waves-effect waves-light #64b5f6 blue darken-1"
                        disabled= {isLoading}
                    >Reset Password
                    </button>
                </div>
            </div>
        </form>
    );
}
 
export default NewPassword;