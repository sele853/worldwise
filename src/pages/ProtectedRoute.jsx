import  { useEffect } from "react"
import { UseAuth } from "../Contexts/FakeAuthContext"
import { useNavigate } from "react-router-dom";


function ProtectedRoute({children}) {
    const {isAutenticated}= UseAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!isAutenticated) navigate('/');

    },[isAutenticated,navigate])
   
    return isAutenticated ? children : null;
}

export default ProtectedRoute
