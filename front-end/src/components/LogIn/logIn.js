import {Button} from 'react-bootstrap';
// import LoginModal from '../modals/loginModal.js';
import React, {useState} from 'react';
import LogAndSignModal from '../modals/logAndSignModal';


function LogIn(props) {

    const [modalShow,
        setModalShow] = useState(false);
    const [loginVar,
        setLoginVar] = useState(true);
    const btnClick = () => {
        setModalShow(true);
        setLoginVar(true);
    }

    return ( 
        <> 
            <Button
            variant="outline-light"
            onClick={() => btnClick()}
            className="mr-sm-2 button-outline">Log In</Button> 
            < LogAndSignModal 
                loginVar={loginVar}
                rotate={()=>setLoginVar(!loginVar)}
                show = {modalShow}
                onHide = {() => setModalShow(false)}
                showUserIcon = {props.showUserIcon} 
                setUser = {props.setUser}
            /> 
        </>)

}

export default LogIn;