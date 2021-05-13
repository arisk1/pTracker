import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <div>
            <Route
                {...rest}
                render={props =>
                    !localStorage.token ? (
                        <Redirect to='/' />
                    ) : (
                        <Component {...props} />
                    )
                }
            />
        </div>
    )
}

export default PrivateRoute
