import {Fragment, useState } from 'react';
import { ListGroup,Row, Col,Button} from 'react-bootstrap';
import upArrow from '../CoinList/up-arrow.png';
import downArrow from '../CoinList/down-arrow.png';
import SmallPriceChart from '../PriceChart/SmallPriceChart';
import PercChange from '../PercChange/PercChange';

const PortfolioCoinList = (props) => {
    const { coins , portfolioCoins ,currency,portfolio } = props

    //merge arrays and sort them according to holdings
    
    const array = coins.map((value,index)=>{
        return ( {...value,...portfolioCoins[index]} );       
    });
    array.sort((a, b) => (a.holdings > b.holdings) ? -1 : 1)//desc

    const [reverseCoins,setReverseCoins] = useState(false);

    const percChangeCalc = (pnl , position ) => {
        if(pnl < 0){
            let x = (100*(-1*pnl)) / position;
            return (-1*x) 
        }else{
            let x = (100*pnl)/position;
            return x
        }
    }
    const ArrowToggle = () => {
        if(!reverseCoins){
            return(
                <img
                alt="downArrow-logo"
                src={downArrow}
                width="15"
                height="15"
                className="d-inline-block align-middle user-img"/>
            )
        }else{
            return(
                <img
                alt="upArrow-logo"
                src={upArrow}
                width="15"
                height="15"
                className="d-inline-block align-middle user-img"/>
            )
        }
        
    }

    const portfolioDetails = () => {
        return (
            <ListGroup.Item>
            <Row className=''>
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
                        Number of coins in your portfolio:
                    </Col>
                </Row>
                <Row>
                    <Col >
                       {(portfolio.coins).length}
                    </Col>
                </Row>
            </Col>
        </Row>
            </ListGroup.Item>
        )
    }
    const topInfo = () => {
        if (array.length > 0) {
            return (
                <ListGroup.Item
                    style={{
                    backgroundColor: '#C0C0C0'
                }}>
                    <Row className="text-bold">
                        <Col style={{textAlign: 'left'}}> # </Col>
                        <Col style={{textAlign: 'left'}}> Name </Col>
                        <Col> Price </Col>
                        <Col> 24h Change </Col>
                        <Col> MarketCap </Col>
                        {/* <Col as={Button}
                            className='px-15 py-0 hover-mc'
                            variant=""
                            onClick={()=>setReverseCoins(!reverseCoins)}>
                            <ArrowToggle/>
                            <span className="text-bold">MarketCap</span>
                        </Col> */}
                        <Col>
                            Chart - 7d
                        </Col>
                        <Col  as={Button}
                            className='px-15 py-0 hover-mc'
                            variant=""
                            onClick={()=>setReverseCoins(!reverseCoins)}>
                            <ArrowToggle/>
                            <span className="text-bold">Holdings</span>
                        </Col>
                        <Col>
                                Pnl
                        </Col>
                       
                    </Row>
                </ListGroup.Item>
            )
        }
    }

    const coinsMap = () => {
        if(!reverseCoins){
            return(
                array.map((coin,idx) => (
                    <ListGroup.Item key={idx} >
                        <Row className="align-items-center">
                            <Col style={{textAlign: 'left'}}>
                                {coin.market_cap_rank}
                            </Col>
                            <Col style={{textAlign: 'left'}}>
                                <img alt={coin.id} className="img" src={coin.image}/>{coin.name}
                            </Col>
                            <Col>{(coin.current_price).toLocaleString()}</Col>
                            <Col> 
                                <PercChange perc_change={coin.price_change_percentage_24h_in_currency} />
                            </Col>
                            <Col>
                                {coin.market_cap.toLocaleString()}
                            </Col>
                            <Col>
                                <SmallPriceChart 
                                    perc_change={coin.price_change_percentage_7d_in_currency}
                                    sparkline={coin.sparkline_in_7d}
                                />
                            </Col>
                            <Col >
                                <Row>
                                    <Col>
                                        {coin.quantity}{' '}{(coin.symbol).toUpperCase()}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {(coin.holdings).toLocaleString()}{' '}{(currency).toUpperCase()}
                                    </Col>
                                </Row>
                            </Col>
                            <Col >
                            <Row>
                                    <Col>
                                        {(coin.sumPnLOfCoin).toLocaleString()}{' '}{(currency).toUpperCase()}
                                    </Col>
                                </Row><Row>
                                    <Col>
                                        <PercChange perc_change={percChangeCalc(coin.sumPnLOfCoin,coin.sumPositionOfCoin)} />
                                    </Col>
                                </Row>
                               
                            </Col>
                            
                        </Row>
                    </ListGroup.Item>
                ))
            )
        }else{
            return(
                array.map((coin,idx) => (
                    <ListGroup.Item key={idx} >
                        <Row className="align-items-center">
                            <Col style={{textAlign: 'left'}}>
                                {coin.market_cap_rank}
                            </Col>
                            <Col style={{textAlign: 'left'}}>
                                <img alt={coin.id} className="img" src={coin.image}/>{coin.name}
                            </Col>
                            <Col>{coin.current_price}</Col>
                            <Col> 
                                <PercChange perc_change={coin.price_change_percentage_24h_in_currency} />
                            </Col>
                            <Col>
                            {coin.market_cap.toLocaleString()}
                            </Col>
                            <Col>
                                <SmallPriceChart
                                    perc_change={coin.price_change_percentage_7d_in_currency}
                                    sparkline={coin.sparkline_in_7d}
                                />
                            </Col>
                            <Col >
                                <Row>
                                    <Col>
                                        {coin.quantity}{' '}{(coin.symbol).toUpperCase()}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {coin.holdings}{' '}{(currency).toUpperCase()}
                                    </Col>
                                </Row>
                            </Col>
                            <Col >
                            <Row>
                                    <Col>
                                        {coin.sumPnLOfCoin}{' '}{(currency).toUpperCase()}
                                    </Col>
                                </Row><Row>
                                    <Col>
                                        <PercChange perc_change={percChangeCalc(coin.sumPnLOfCoin,coin.sumPositionOfCoin)} />
                                    </Col>
                                </Row>
                               
                            </Col>
                            
                        </Row>
                    </ListGroup.Item>
                )).reverse()
            )
        }
        
    }


    return (
        <Fragment> 
        
        <ListGroup variant="flush">
            {portfolioDetails()}
            {topInfo()}
            {coinsMap()}
        </ListGroup>
        </Fragment>
    )
}

export default PortfolioCoinList;
