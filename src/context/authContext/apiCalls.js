
import axios from 'axios'
import REACT_APP_API_URL from '../../api'
import { loginFailure, loginStart, loginSuccess } from './AuthAction'


export const login = async (user, dispatch) => {
    dispatch(loginStart())
    try {
        const res = await axios.post(`${REACT_APP_API_URL}auth/login`, user)
        res.data.isAdmin && dispatch(loginSuccess(res.data))
    } catch (error) {
        dispatch(loginFailure())
    }

}