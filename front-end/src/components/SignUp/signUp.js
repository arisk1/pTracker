import {Button} from 'react-bootstrap';
import React, {useState} from 'react';
import SignUpModal from '../modals/signupModal.js';


function SignUp(props) {

    const [modalShow,
        setModalShow] = useState(false);

    return (
        <>
        <Button 
            variant="dark"
            onClick={() => setModalShow(true)}
            className="mr-sm-2 button-outline">
            Sign Up
        </Button>
        <SignUpModal
            show = {modalShow}
            onHide = {() => setModalShow(false)}
            showUserIcon = {props.showUserIcon} 
            setUser = {props.setUser} 
        />
        </>
    )

}

export default SignUp;