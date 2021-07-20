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

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]


    return(
        <Fragment>
            {console.log(coins)}
            <Button variant="outline-danger" onClick={handleShow}>Remove Coin</Button>{' '}

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Remove a coin from your portfolio</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{fontSize : '22px'}}>
                <Form onSubmit={closeAndRemove}>
                    <Form.Group  controlId="formBasicPortfolioName">
                       <Form.Label style={{color: 'grey',fontSize : '14px'}}>Choose the coin from your portfolio you want to remove</Form.Label>
                        <Form.Control
                            as="select"
                            onChange={(e)=>setrCoin(e.target.value)}
                            type="text"
                            name="name"
                            placeholder="Enter coin's name..."
                            required
                            options={options}>
                                {coins.map((coin)=>{
                                    return (
                                        <option key={coin.id} value={coin.id}>
                                           {coin.name}
                                        </option>
                                    )
                                })}
                        </Form.Control>
                        
                       
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