import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router"
import type { RootState } from "../store/store"
import { USERTOKEN } from "../constant"
import { authInitialState, saveUserData } from "../features/auth/authSlice"
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from "../components/LanguageSwitcher"

function Header(){
    const { t } = useTranslation()
    const userData = useSelector((state: RootState)=> state.auth.userData)

    const navigator = useNavigate()
    const dispatch = useDispatch()
    const logout = () => {
        dispatch(saveUserData(authInitialState.userData))
        localStorage.removeItem(USERTOKEN)
        navigator('/login')
    }

    return <div style={{ display: 'flex' }}>
        {
            userData.email.trim() === '' && <Link to={'/login'} style={{ marginRight: "10px" }}>{t('nav.login')}</Link>
        }

        <LanguageSwitcher/>

        {
            userData.email.trim() !== '' && 
            <div style={{ display: 'flex', alignSelf: 'end' }}>
                <div>{ userData.email }</div>
                <button onClick={logout}>{t('nav.logout')}</button>
            </div>
        }
    </div>
}

export default Header