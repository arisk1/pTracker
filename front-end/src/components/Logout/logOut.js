import {Dropdown} from 'react-bootstrap';
import React, { useContext } from 'react';
import AuthContext from '../../context/auth/authContext';

const LogOut = (props) => {
    const authContext = useContext(AuthContext);
    const { logout } = authContext;

    let dropDownLinkStyle = {
        color: 'red',
    };

    const logoutHandler = (e) => {
        e.preventDefault();
        logout()
    }

    return (
        <Dropdown.Item onClick={logoutHandler} style={dropDownLinkStyle}>Logout</Dropdown.Item>
    )

}

export default LogOut;