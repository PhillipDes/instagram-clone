import { UserContext } from '../context/UserContext'
import { useContext } from 'react'

export const useUserContext = () => {
    const context = useContext(UserContext)
    
    //check if the context is trying to be used outside of where it's included
    if (!context) {
        throw Error('useUserConext must be used inside a UserContextProvider')
    }

    return context
}