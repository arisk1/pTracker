import React from 'react';
import { ListGroup,Row, Col} from 'react-bootstrap';
import PercChange from '../PercChange/PercChange';

const TransactionSpecs = (props) => {

     const {history,balance,quantity,currency,coinPnl,calculateCurrency} = props

     const colorNumbers = (res) => {
         if(res < 0 ){
             return <Col ><span style={{color : 'red'}}>{res}</span>{' '}{currency} </Col>
         }else{
            return <Col><span style={{color : 'green'}}>{"+" + res}</span>{' '}{currency} </Col>
         }
     }

    return (
        <ListGroup.Item>
        <Row >
        <Col   className='p-details'>
            <Row>
                <Col className="text-bold">
                    Total Balance:
                </Col>
            </Row>
            <Row>
                
                <Col>
                   {calculateCurrency(balance).toLocaleString()}{' '}{currency}
                </Col>
            </Row>
        </Col>
        <Col  className='p-details'>
            <Row>
                <Col className="text-bold">
                Quantity:
                </Col>
            </Row>
            <Row>
                <Col >
                    {quantity}
                </Col>
            </Row>
        </Col>
        <Col  className='p-details'>
            <Row>
                <Col className="text-bold" >
                Total Profit Loss:<br/>
                </Col>
            </Row>
            <Row>
                
                {(colorNumbers(calculateCurrency(coinPnl)))}

               
            </Row>
        </Col>
        <Col   className='p-details'>
            <Row>
                <Col className="text-bold">
                    Number of transactions:
                </Col>
            </Row>
            <Row>
                <Col >
                   {history.length}
                </Col>
            </Row>
        </Col>
    </Row>
        </ListGroup.Item>
    )
}

export default TransactionSpecs