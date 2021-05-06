import React from 'react'
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken'
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types'

const AuthState = (props) => {
    // define initial state
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        user: null,
        error: null
    }

    // setup the reducer
    const [state, dispatch] = useReducer(authReducer, initialState)

    // functions
    // load user: get logged in user

    // register user

    // login user

    // logout

    // clear errors

    return (
        <AuthConext.Provider value={{
            // token: state.token,
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            error: state.error,
        }}>
            {props.children}
        </AuthConext.Provider>
    )
}

export default AuthState
