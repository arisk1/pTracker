import {Dropdown} from 'react-bootstrap';
import React from 'react';
import axios from 'axios';

function LogOut(props) {

    let dropDownLinkStyle = {
        color: 'red',
    };

    const logOutUser = async() => {
        try {
            const res = await axios.post('http://localhost:3001/users/logout',{}, {
                headers: {
                    Authorization: 'Bearer '+ props.token            
                }
            })
            console.log(res);
            props.hideUserIcon();
        } catch (e) {
            console.log(e.message)
        }
    }

    const logoutHandler = (e) => {
        e.preventDefault();
        logOutUser();
    }

    return (
        <Dropdown.Item onClick={logoutHandler} style={dropDownLinkStyle}>Logout</Dropdown.Item>
    )

}

export default LogOut;