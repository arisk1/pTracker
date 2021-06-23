import React, { Fragment,useState, useContext, useEffect, useRef} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const RemoveCoinModal = (props) => {

    const [show, setShow] = useState(false);
    const [newCoin,setNewCoin] = useState("");
  
    const handleClose = () => setShow(false);

    const closeAndRemove = () => {
        props.removeCoin(newCoin,props.pid)
        setShow(false)
    }
    
    const handleShow = () => setShow(true);



    return(
        <Fragment>
            <Button variant="outline-danger" onClick={handleShow}>Remove Coin</Button>{' '}

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Remove a coin from your portfolio</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{fontSize : '22px'}}>
                <Form>
                    <Form.Group controlId="formBasicPortfolioName">
                        <Form.Control
                            onChange={(e)=>setNewCoin(e.target.value)}
                            type="text"
                            name="name"
                            placeholder="Enter coin's name..."
                            required/>
                    </Form.Group>
                </Form>
                <Button variant='dark' size="lg" onClick={closeAndRemove} block>
                    Remove coin   
                </Button>
            </Modal.Body>
        </Modal>
        </Fragment>

    )
}

export default RemoveCoinModal;