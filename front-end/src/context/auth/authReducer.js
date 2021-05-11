import {
    SIGNUP_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGOUT,
    CLEAR_ERRORS
} from '../types'
// eslint-disable-next-line
export default (state, action) => {
    switch(action.type){
        case SIGNUP_SUCCESS:
        case LOGIN_SUCCESS:
            localStorage.setItem('token', action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            }
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload
            }
        case AUTH_ERROR:
        case LOGOUT:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null, 
                isAuthenticated: false,
                user: null, 
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}