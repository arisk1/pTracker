import React, { Fragment,useState, useContext, useEffect, useRef} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddCoinModal = (props) => {

    const [show, setShow] = useState(false);
    const [newCoin,setNewCoin] = useState("");
  
    const handleClose = () => setShow(false);

    const closeAndAdd = () => {
        props.addCoin(newCoin,props.pid)
        setShow(false)
    }
    
    const handleShow = () => setShow(true);



    return(
        <Fragment>
            <Button variant="primary" onClick={handleShow}>Add Coin</Button>{' '}

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add new coin</Modal.Title>
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
                <Button variant='dark' size="lg" onClick={closeAndAdd} block>
                    Add   
                </Button>
            </Modal.Body>
        </Modal>
        </Fragment>

    )
}

export default AddCoinModal;