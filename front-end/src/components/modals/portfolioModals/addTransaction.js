import React, { Fragment,useEffect,useState} from 'react';
import { Modal, Button, Form,Dropdown,InputGroup,DropdownButton } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';

const AddTransaction = (props) => {

    const {coin , addTransaction ,currency,currencyR,btcExRate,vsCurrencies} = props

    const [show, setShow] = useState(false);
    const [typeOfTransaction,setTypeOfTransaction] = useState("buy");
    const [quantity,setQuantity] = useState(1);
    const [pricePerCoin,setPricePerCoin] = useState(0);
    const [dateValue, setDateValue] = useState(new Date());
    const [transactionCuurency, setTransactionCurrency] = useState(currencyR);
   
    const calculateCurrencyModal = (price) => {
        if(transactionCuurency === currencyR){
            //do nothing
            return price;
        //calculate base on btc exchange rate
        }else {
            //first convert to btc 
            const res = price / btcExRate[currencyR].value;
            if(transactionCuurency === 'btc'){
                return res.toFixed(2);
            }else{
                //then to the desired currency
                const res2 = (btcExRate[transactionCuurency].value)*res;
                return res2.toFixed(2);
            } 
        }   
    }


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
        setPricePerCoin(0);
        setQuantity(1);
        setTransactionCurrency(currencyR);
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
                    <Form.Label style={{fontSize : '18px'}}>Price Per Coin</Form.Label>
                    <InputGroup >
                    <DropdownButton
                        menuAlign="left"
                        as={InputGroup.Append}
                        variant="outline-secondary"
                        id="from"
                        title={"Currency : " + transactionCuurency.toUpperCase()}
                    >
                        <Dropdown.Header>Choose desired currency</Dropdown.Header>
                        <Dropdown.Divider />
                        {vsCurrencies.map((ccurrency)=>{
                            return <DropdownItem onClick={()=> setTransactionCurrency(ccurrency)}>{ccurrency}</DropdownItem>
                        })}
                    </DropdownButton>
                    <Form.Control
                        autoComplete="off"
                        required
                        type="text"
                        name="name"
                        placeholder={"1 " + coin.symbol.toUpperCase() + " = " + calculateCurrencyModal(coin.current_price) + " " + btcExRate[transactionCuurency].unit}
                        onChange={(e)=>setPricePerCoin(e.target.value)}
                    />
                    
                </InputGroup>
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
                        placeholder={pricePerCoin*quantity + " " + btcExRate[transactionCuurency].unit}
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