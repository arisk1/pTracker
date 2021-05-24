import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import  { pingApi } from '@arisk1/cg-functions';
import CGDown from '../alert/CGDown'

const CGRoute = ({ component: Component, ...rest }) => {
    const [cgDown, 
        setCgDown] = useState(false)
    
    useEffect(() => {
        const checkServer = async () => {
            // ping
            const ping = await pingApi()
            if(ping.status && ping.status === 200){
                setCgDown(false)
            }
            else {
                setCgDown(true)
            }
        }
        checkServer()
    }, [])

    return (
        <div>
            <Route
                {...rest}
                render={props =>
                    cgDown ? (
                        <CGDown />
                    ) : (
                        <Component {...props} />
                    )
                }
            />
        </div>
    )
}

export default CGRoute
