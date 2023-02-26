import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import M from 'materialize-css'

const Reset = () => {
    const [email, setEmail] = useState('')
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
        fetch('/resetpassword', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email
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
        <form onSubmit={sumbitSignin}>
            <div className="mycard">
                <div className="card auth-card input-field">
                    <h2 className='brand-logo'>InstaClone</h2> 
                    <input 
                        type="text" 
                        placeholder="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} />
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
 
export default Reset;