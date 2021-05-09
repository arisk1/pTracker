import { Button } from 'react-bootstrap';
import React, { useState, Fragment } from 'react';
import LogAndSignModal from '../modals/logAndSignModal';

const SignUp = (props) => {

    const [modalShow,
        setModalShow] = useState(false);
    const [loginVar,
        setLoginVar] = useState(false);
    const btnClick = () => {
        setModalShow(true);
        setLoginVar(false);
    }
    return ( 
        <Fragment> 
            <Button
                variant="dark"
                onClick={() => btnClick()}
                className="mr-sm-2 button-outline">
                Sign Up
            </Button> 
            < LogAndSignModal 
                loginVar = {loginVar}
                rotate = {() =>setLoginVar(!loginVar)}
                show = {modalShow}
                onHide = {() => setModalShow(false)}
            /> 
        </Fragment>
    )

}

export default SignUp;