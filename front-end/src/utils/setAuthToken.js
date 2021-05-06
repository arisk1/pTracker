import axios from 'axios'

const setAuthToken = (token) => {
    if(token) {
        // axios.defaults.headers.common['x-auth-token'] = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    else{
        // delete axios.defaults.headers.common['x-auth-token']
        delete axios.defaults.headers.common['Authorization']
    }
}

export default setAuthToken