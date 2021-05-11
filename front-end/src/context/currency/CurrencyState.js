import React , {useReducer} from 'react';
import CurrencyContext from './currencyContext';
import currencyReducer from './currencyReducer';
import {SET_CURRENCY , GET_CURRENCIES} from '../types';
import { supportedCurrencies } from '@arisk1/cg-functions';

const CurrencyState = (props) => {
    const initialState = {
        currency : "usd",
        vsCurrencies : []
    }

    // setup the reducer
    const [state, dispatch] = useReducer(currencyReducer, initialState)


    //GET_CURRENCIES
    const getCurrencies = async () => {
        localStorage.setItem('currency', 'usd')
        const res = await supportedCurrencies();
        dispatch({
            type : GET_CURRENCIES,
            payload : res.data
        })
    }

    //SET_CURRENCY
    const setCurrency = (cur) => {
        dispatch({type : SET_CURRENCY , payload : cur})
    }
    return (
        <CurrencyContext.Provider
        value={{
            currency : state.currency,
            vsCurrencies : state.vsCurrencies,
            setCurrency,
            getCurrencies
        }}>
            {props.children}
        </CurrencyContext.Provider>
    )
};

export default CurrencyState;