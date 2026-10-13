import { useState } from "react"
import {  useNavigate } from "react-router"
import { USERTOKEN } from "../constant"
import { postAPI } from "../api/api"
import type { LoadingStatus } from "../types"

type Login = {
    email: string
    password: string
}

function JobLogin(){
    const [login, setLogin] = useState<Login>({
        email: '',
        password: ''
    })


    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin((prev)=>({
            ...prev,
            email: event.target.value
        }))
    }

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin((prev)=>({
            ...prev,
            password: event.target.value
        }))
    }

    const [loading, setLoading] = useState<LoadingStatus>('idle')
    const navigate = useNavigate()
    const submit = async () => {
        setLoading('loading')

        try{
            const res = await postAPI({
                url: '/auth/login',
                data: login
            })

            localStorage.setItem(USERTOKEN, res.data.token)
            
            navigate('/')
        }
        catch(e){
            console.log(e)
            return setLoading('error')
        }
    }

    return <div>
        <p><label htmlFor="email">Email:</label><input id='email' name="email" value={login.email} onChange={handleEmail}></input></p>
        <p><label htmlFor="password">Password:</label><input id='password' type="password" name="password" value={login.password} onChange={handlePassword}></input></p>
        
        <button onClick={submit} disabled={loading === 'loading'}>Login</button>

        { loading === 'error' && <p style={{ color: 'red' }}>login email or password is error</p>}
    </div>
}

export default JobLogin