import React from 'react';
import { ListGroup,Row, Col} from 'react-bootstrap';
import PercChange from '../PercChange/PercChange';

const PortfolioSpecs = (props) => {

    const {portfolio,currency,percChangeCalc,numOfCoins} = props


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
                   {(portfolio.sumOfPortfolio).toLocaleString()}{' '}{currency.toUpperCase()}
                </Col>
            </Row>
        </Col>
        <Col  className='p-details'>
            <Row>
                <Col className="text-bold">
                24hr Portfolio Change:<br/><PercChange perc_change={percChangeCalc(portfolio.portfolioChange,portfolio.sumPosition)} />
                </Col>
            </Row>
            <Row>
                <Col >
                {(portfolio.portfolioChange).toLocaleString()}{' '}{currency.toUpperCase()}
                </Col>
            </Row>
        </Col>
        <Col  className='p-details'>
            <Row>
                <Col >
                Total Profit Loss:<br/><PercChange perc_change={percChangeCalc(portfolio.sumPnL,portfolio.sumPosition)} />
                </Col>
            </Row>
            <Row>
                <Col>
                {(portfolio.sumPnL).toLocaleString()}{' '}{currency.toUpperCase()}
                </Col>
            </Row>
        </Col>
        <Col   className='p-details'>
            <Row>
                <Col className="text-bold">
                    Number of coins:
                </Col>
            </Row>
            <Row>
                <Col >
                   {numOfCoins}
                </Col>
            </Row>
        </Col>
    </Row>
        </ListGroup.Item>
    )
}

export default PortfolioSpecs