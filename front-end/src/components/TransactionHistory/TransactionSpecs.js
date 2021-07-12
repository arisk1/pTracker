import React from 'react';
import { ListGroup,Row, Col} from 'react-bootstrap';
import PercChange from '../PercChange/PercChange';

const TransactionSpecs = (props) => {

    // const {portfolio,currency,percChangeCalc,numOfCoins} = props


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
                   {/* {(portfolio.sumOfPortfolio).toLocaleString()}{' '}{currency.toUpperCase()} */}
                   123
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
                123
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
                <Col>
                {123}
                </Col>
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
                   {123}
                </Col>
            </Row>
        </Col>
    </Row>
        </ListGroup.Item>
    )
}

export default TransactionSpecs