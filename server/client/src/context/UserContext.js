import { createContext, useEffect, useReducer } from "react";

export const UserContext = createContext()

export const userReducer = (state, action) => {
    switch (action.type) {
        case 'USER':
            return {user: action.payload}
        case 'CLEAR':
            return {user: null}
        case 'UPDATE':
            return {
                user: {
                    email: state.user.email,
                    followers: action.payload.followers,
                    following: action.payload.following, 
                    name: state.user.name,
                    picture: state.user.picture,
                    __v: state.user.__v, 
                    _id: state.user._id
                }
            }
        case 'UPDATE_PIC':
            return{
                user: {
                    email: state.user.email,
                    followers: state.user.followers,
                    following: state.user.following, 
                    name: state.user.name,
                    picture: action.payload,
                    __v: state.user.__v,
                    _id: state.user._id
                }
            }      
        default:
            return state
    }
}

export const UserContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(userReducer, {user: null})

    //check if a user is logged in after refresh
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        
        if (user) {
            dispatch({type: 'USER', payload: user})
        }

    }, [])


    return (  
        <UserContext.Provider value={{...state, dispatch}}>
            {children}
        </UserContext.Provider>
    );
}