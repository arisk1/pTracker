import {
   SET_CURRENCY,
   GET_CURRENCIES
} from '../types'


export default (state, action) => {
    switch(action.type){
        case SET_CURRENCY:
            localStorage.setItem('currency', action.payload.currency)
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