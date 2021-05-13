import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const authContext = useContext(AuthContext);    // important!

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
