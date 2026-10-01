import React, { useContext, useEffect } from 'react'

import { getToken, useAuth } from '@clerk/react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import UserContext from '../context/UserContext'
const ProtectedRoute = ({children}) => {
    const {setUser}=useContext(UserContext);
    useEffect(()=>{
        const fetchUser=async()=>{
            const token = await getToken();
            const res= await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check`,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            });
            console.log(res.data);
            setUser(res.data);
        }
        fetchUser();
    },[])

    const {isSignedIn,isLoaded}=useAuth();
    if(!isLoaded){
        return <div>Loading...</div>
    }
    if(!isSignedIn){
        return <Navigate to={"/"} replace / >
    }
  return children;
}

export default ProtectedRoute