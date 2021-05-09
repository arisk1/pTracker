import React, { useReducer } from 'react'
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken'
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
    SIGNUP_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGOUT,
    CLEAR_ERRORS
} from '../types'

const AuthState = (props) => {
    // define initial state
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        user: null,
        error: null
    }

    // setup the reducer
    const [state, dispatch] = useReducer(authReducer, initialState)

    // functions
    // load user: get logged in user
    const loadUser = async () => {
        if(localStorage.token) {
            setAuthToken(localStorage.token)
        }

        try {
            const res = await axios.get('/users/me')
            dispatch({ type:USER_LOADED, payload: res.data })
        } catch (err) {
            dispatch({ type: AUTH_ERROR })
        }
    }

    // register user
    const signup = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/users', formData, config);
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: res.data
            })
            loadUser()
            return res
        } catch (err) {
            return err.response
        }
    }

    // login user
    const login = async (formData) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
            const res = await axios.post('/users/login', formData, config);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
            loadUser()
            return res
        } catch (err) {
            return err.response
        }
    }

    // logout
    const logout = async () => {
        try {
            await axios.post('/users/logout');
            dispatch({ type: LOGOUT })
        } catch (err) {
            console.log(err.response)
            dispatch({ type: AUTH_ERROR, payload: err.response.data.error })  //?
        }
    }

    // clear errors
    const clearErrors = () => {
        dispatch({ type:CLEAR_ERRORS })
    }

    return (
        <AuthContext.Provider value={{
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            error: state.error,
            loadUser,
            signup,
            login,
            logout,
            clearErrors
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState;
