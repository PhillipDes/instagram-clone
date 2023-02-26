import React, { useEffect, useRef, useState } from "react"
import {Link, useNavigate} from 'react-router-dom'
import { useUserContext } from "../hooks/useUserContext";
import M from 'materialize-css'

const Navbar = () => {
    const {user, dispatch} = useUserContext()
    const [search, setSearch] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const navigate = useNavigate()
    const searchModal = useRef(null)

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        dispatch({type:'CLEAR'})
        navigate('/signin')
    }

    const fetchUsers = (query) => {
        setSearch(query)
        
        if(query) {
            fetch('/searchusers', {
            method: 'post',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                query
            })
            }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user)
            })
        } else {
            setUserDetails([])
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to="/" className="brand-logo">InstaClone</Link>
                <ul id="nav-mobile" className="right">
                    {user ? ( 
                        <div>
                            <li key='1'><i 
                                className="large material-icons modal-trigger" 
                                data-target="modal1" 
                                style={{color:'black'}}
                                onClick={() => {
                                    setSearch('')
                                    setUserDetails([])
                                }} 
                                >search</i>
                            </li>
                            <li key='2'><Link to="/profile">Profile</Link></li>
                            <li key='3'><Link to="/create">Create Post</Link></li>
                            <li key='4'><Link to="/following">Following</Link></li>
                            <li key='5'><button 
                                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                onClick={() => handleLogout()}
                            >Logout
                            </button></li>
                        </div>
                    ) : (
                        <div>
                            <li key='6'><Link to="/signin">Sign in</Link></li>
                            <li key='7'><Link to="/signup">Sign up</Link></li>
                        </div>
                    )} 
                </ul>
            </div>
            <div id="modal1" className="modal" ref={searchModal} >
                <div className="modal-content" style={{color:'black'}}>
                    <input 
                        type="text" 
                        placeholder="Search user" 
                        value={search} 
                        onChange={(e) => fetchUsers(e.target.value)} />
                    <ul className="collection">
                        {userDetails.map(item => {
                            return ( 
                                <Link 
                                    to= {item._id !== user._id ? "/profile/" + item._id : "/profile/"} 
                                    onClick= {() => {
                                        M.Modal.getInstance(searchModal).close()
                                        setSearch('')
                                        setUserDetails([])
                                    }}
                                >
                                    <li className="collection-item">{item.name}</li>
                                </Link>
                            )
                            
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button>
                </div>
            </div>
        </nav>
    );
}
 
export default Navbar;