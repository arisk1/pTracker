import React, { useState, useContext, useEffect, useRef} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


const WarningModal = (props) => {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const closeAndDelete = () => {
        props.deletePortfolio(props.pid);
        setShow(false)
    }
    const handleShow = () => setShow(true);
  
    return (
      <>
        {/* <Button onClick={()=>deletePortfolio(portfolio._id)} variant='outline-danger' size='sm' >Delete</Button> */}
        <Button variant="outline-danger" onClick={handleShow}>
          Delete
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>You just tried to delete a portfolio</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{fontSize : '22px'}}>Are you sure you want to delete the portfolio with name : <span style={{fontWeight : 'bold'}}> {props.name} </span>
                      <p style={{fontSize : '12px'}}>Disclaimer:You will not be able to recover this portfolio!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              No! Go back
            </Button>
            <Button variant="danger" onClick={closeAndDelete}>
              Yes! Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  export default WarningModal;