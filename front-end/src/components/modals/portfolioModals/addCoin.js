import React, { Fragment,useState, useContext, useEffect, useRef} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddCoinModal = (props) => {

    const [show, setShow] = useState(false);
    const [newCoin,setNewCoin] = useState("");
  
    const handleClose = () => setShow(false);

    const closeAndAdd = (e) => {
        e.preventDefault();
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
                <Form onSubmit={closeAndAdd}>
                    <Form.Group controlId="formBasicPortfolioName">
                        <Form.Control
                            onChange={(e)=>setNewCoin(e.target.value)}
                            type="text"
                            name="name"
                            placeholder="Enter coin's name..."
                            required/>
                    </Form.Group>
                    <Button variant='dark' type="submit" size="lg" block>
                    Add   
                </Button>
                </Form>
               
            </Modal.Body>
        </Modal>
        </Fragment>

    )
}

export default AddCoinModal;