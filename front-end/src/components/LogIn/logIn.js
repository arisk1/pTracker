import { Button } from 'react-bootstrap';
import React, { useState, Fragment } from 'react';
import LogAndSignModal from '../modals/logAndSignModal';


const LogIn = (props) => {

    const [modalShow,
        setModalShow] = useState(false);
    const [loginVar,
        setLoginVar] = useState(true);
    const btnClick = () => {
        setModalShow(true);
        setLoginVar(true);
    }

    return ( 
        <Fragment> 
            <Button
            variant={props.variant}
            onClick={() => btnClick()}
            className={props.class}>Log In</Button> 
            < LogAndSignModal 
                loginVar={loginVar}
                rotate={()=>setLoginVar(!loginVar)}
                show = {modalShow}
                onHide = {() => setModalShow(false)}
            /> 
        </Fragment>)

}

export default LogIn;