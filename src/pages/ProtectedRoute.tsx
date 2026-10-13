import { Navigate, Outlet } from "react-router"
import { USERTOKEN } from "../constant"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { saveUserData } from "../features/auth/authSlice"
import { getAPI } from "../api/api"

function ProtectedRoute () {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    const dispatch = useDispatch()

    const getUserInfo = async () => {
        try {
            const res = await getAPI({
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
            console.log(e)
            localStorage.removeItem(USERTOKEN)
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