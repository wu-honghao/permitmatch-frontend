import { Navigate, Outlet } from "react-router"
import { USERTOKEN } from "../constant"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { clearUserData, saveUserData } from "../features/auth/authSlice"
import { ApiError, getAPI, type ApiResponse } from "../api/api"

type AuthMe = {
    id: string
    email: string
}

function ProtectedRoute () {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    const dispatch = useDispatch()

    const getUserInfo = async () => {
        try {
            const res = await getAPI<ApiResponse<AuthMe>>({
                url: "/auth/me",
                headersOption:{
                    isAuthorization: true
                }
            })

            dispatch(saveUserData({
                email: res.data.email
            }))
            
            setIsAuthenticated(true)
        } catch(e){
            if (e instanceof ApiError && e.status === 401) {
                localStorage.removeItem(USERTOKEN);
                dispatch(clearUserData())
                setIsAuthenticated(false);
                return;
            }

            console.error(e);
            setIsAuthenticated(false)
        }
    }

    useEffect(()=>{
        getUserInfo()
    },[])

    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute