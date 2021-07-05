import React, { Fragment,useEffect,useState} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddTransaction = (props) => {

    const {coin , addTransaction} = props

    const [show, setShow] = useState(false);
    const [typeOfTransaction,setTypeOfTransaction] = useState("buy");
    const [pricePerCoin,setPricePerCoin] = useState(coin.current_price);
    const [quantity,setQuantity] = useState(1);
    const [dateValue, setDateValue] = useState(new Date());
   
    const handleClose = () => setShow(false);

    const closeAndAddTransaction = (e) => {
        e.preventDefault();
        addTransaction(typeOfTransaction,coin.id,quantity,pricePerCoin,dateValue);
        setShow(false)
    }
    
    const handleShow = () => {
        setShow(true)
    };

    const resetValues = () => {
        setPricePerCoin(coin.current_price);
        setQuantity(1)
    }

    return(
       
        <Fragment>
        <Button variant="primary" style={{fontSize : '10px'}} onClick={handleShow}>Add Transaction  </Button>{' '}

        <Modal show={show} onShow={()=>resetValues()} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Add your new transaction for
        <br/>{coin.name}{' '}<span style={{fontSize : '17px',color : 'grey'}}>({(coin.symbol).toUpperCase()})</span><img alt={coin.id} className="img-form" src={coin.image}/>
        </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize : '22px'}}>
            <Form onSubmit={closeAndAddTransaction}>
                <Form.Group controlId="formChooseTransaction">
                    <Form.Label style={{fontSize : '18px'}}>Choose type of Transaction</Form.Label>
                    <Form.Control 
                        as="select" 
                        aria-label="Choose type of Transaction"
                        onChange={(e)=>setTypeOfTransaction(e.target.value)}
                    >
                      <option value="buy">Buy</option>
                       <option value="sell">Sell</option>
                      <option value="transferin">Transfer in</option>
                      <option value="transferout">Transfer out</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formPricePerCoin">
                    <Form.Label style={{fontSize : '18px'}}>Price Per Coin <span style={{fontSize : '17px',color : 'grey'}}>({(coin.symbol).toUpperCase()})</span></Form.Label>
                    <Form.Control
                        onChange={(e)=>setPricePerCoin(e.target.value)}
                        type="text"
                        name="name"
                        placeholder={coin.current_price}
                        required/>
                </Form.Group>
                <Form.Group controlId="formBasicQuantity">
                    <Form.Label style={{fontSize : '18px'}}>Quantity</Form.Label>
                    <Form.Control
                        onChange={(e)=>{setQuantity(e.target.value)}}
                        type="text"
                        name="name"
                        placeholder={1}
                        required/>
                </Form.Group>
                {(typeOfTransaction === "buy" || typeOfTransaction === "sell") ? <Form.Group controlId="formBasicTotalSpent">
                    <Form.Label style={{fontSize : '18px'}}>{(typeOfTransaction === "buy")  ? "Total Spent" : "Total Recieved" }</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder={pricePerCoin*quantity}
                        disabled />
                </Form.Group> : null }
                <Form.Group controlId="formBasicQuantity">
                    <Form.Label style={{fontSize : '18px'}}>Date</Form.Label>
                    <Form.Text style={{fontSize :'12px'}} className="text-muted">
                        Default Date {Date()}
                    </Form.Text>
                    <Form.Control
                        type="datetime-local"
                        onChange={(e)=>{console.log(dateValue);setDateValue(new Date(e.target.value))}}
                        name="name"
                        />
                </Form.Group>
                <Button variant='dark' type="submit" size="lg" block>
                Add Transaction   
            </Button>
            </Form>
           
        </Modal.Body>
    </Modal>
    </Fragment>
    
    )
}

export default AddTransaction