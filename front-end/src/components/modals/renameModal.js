import React, { useState, useContext, useEffect, useRef} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import gear from '../Portfolio/gear.png';


const RenameModal = (props) => {
    const [show, setShow] = useState(false);
    const [newPortfolioName,setNewPortfolioName] = useState("");
  
    const handleClose = () => setShow(false);

    const closeAndRename = () => {
        props.renamePortfolio(props.pid , newPortfolioName,props.pidx)
        setShow(false)
    }
    
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="light" onClick={handleShow} >
        <img
            alt="settings-logo"
            src={gear}
            width="25"
            height="25"
            className="d-inline-block align-middle "/>
        </Button>
  
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Rename your portfolio</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{fontSize : '22px'}}>
                <Form>
                    <Form.Group controlId="formBasicPortfolioName">
                        <Form.Label>Portfolio's name</Form.Label>
                        <Form.Control
                            onChange={(e)=>setNewPortfolioName(e.target.value)}
                            type="text"
                            name="name"
                            placeholder="Enter your portfolio's new name..."
                            required/>
                    </Form.Group>
                </Form>
                <Button variant='dark' size="lg" onClick={closeAndRename} block>
                    Submit   
                </Button>
            </Modal.Body>
        </Modal>
      </>
    );
  }

  export default RenameModal;