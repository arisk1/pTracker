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
        <Button variant="outline-danger" onClick={handleShow}>
          Delete
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title style={{textDecoration : 'underline'}} >Portfolio Deletion!</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{fontSize : '22px'}}>Are you sure you want to delete one of your portfolios which name is : <span style={{fontWeight : 'bold'}}> {props.name} </span>
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