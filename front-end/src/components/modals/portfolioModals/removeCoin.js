import React, { Fragment,useState, useContext, useEffect, useRef} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const RemoveCoinModal = (props) => {

    const { coins } = props
    const [show, setShow] = useState(false);
    const [rCoin,setrCoin] = useState("");
    const [error,setError] = useState(false);

    const ShowError = () => {
        return(
            <Fragment>
            <span style={{
                color: "red",
                paddingBottom: "1vh",
                fontSize: "14px"
            }}>
                the coin you are trying to remove is not part of your portfolio
            </span>
            </Fragment>
        )
    }
  
    const handleClose = () => setShow(false);

    const closeAndRemove = (e) => {
        e.preventDefault();
        props.removeCoin(rCoin,props.pid)
        setShow(false)
        
    }
    
    const handleShow = () => {
        setShow(true)
        setError(false)
    };



    return(
        <Fragment>
            <Button variant="outline-danger" onClick={handleShow}>Remove Coin</Button>{' '}

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Remove a coin from your portfolio</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{fontSize : '22px'}}>
                <Form onSubmit={closeAndRemove}>
                    <Form.Group controlId="formBasicPortfolioName">
                        <Form.Control
                            onChange={(e)=>setrCoin(e.target.value)}
                            type="text"
                            name="name"
                            placeholder="Enter coin's name..."
                            required/>
                    </Form.Group>
                    {error ? <ShowError/> : null}
                    <Button variant='dark' type="submit" size="lg" block>
                    Remove Coin   
                </Button>
                </Form>
                
            </Modal.Body>
        </Modal>
        </Fragment>

    )
}

export default RemoveCoinModal;