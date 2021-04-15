import {Button} from 'react-bootstrap';
import LoginModal from '../modals/loginModal.js';
import React , { useState} from 'react';
//make a call to the api 

function LogIn() {

    const [modalShow, setModalShow] = useState(false);
    const hideModal = () => {
        setModalShow(false);
    }

    return(
         <>
         <Button variant="outline-light" onClick={() => setModalShow(true)} className="mr-sm-2 button-outline">Log In</Button>
         <LoginModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            // set={hideModal} 
        />
      </>
    )

}

export default LogIn;