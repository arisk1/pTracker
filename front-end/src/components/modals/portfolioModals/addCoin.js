import React, { Fragment,useState, useContext, useEffect, useRef} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddCoinModal = (props) => {

    const [show, setShow] = useState(false);
    const [newCoin,setNewCoin] = useState("");
    const [error,setError] = useState(false);
  
    const handleClose = () => setShow(false);

    const ShowError = () => {
        return (
            <Form.Text
                className=""
                style={{
                color: "red",
                paddingBottom: "1vh",
                fontSize: "14px"
            }}>
            This coin is already a part of your portfolio!
            </Form.Text>
        );
    }

    const closeAndAdd = (e) => {
        e.preventDefault();
        const i = (props.coins).map((coin)=>{
            if(coin.id === newCoin){
                setError(true)
                return "dont-add";
            }else{
                return null;
            }
        })
        if(!i.includes('dont-add')){
            props.addCoin(newCoin,props.pid)
            setShow(false)
        }
    }
    
    const handleShow = () => {setShow(true);setError(false)};



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
                            {error ? <ShowError /> : null}
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