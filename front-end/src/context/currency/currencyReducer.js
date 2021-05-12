import {
   SET_CURRENCY,
   GET_CURRENCIES
} from '../types'
// eslint-disable-next-line
export default (state, action) => {
    switch(action.type){
        case SET_CURRENCY:
            localStorage.setItem('currency', action.payload)
            return {
                ...state,
                currency : action.payload,
            }
        case GET_CURRENCIES:
            return {
                ...state,
                vsCurrencies : action.payload,
            } 
        default:
            return state
    }
}