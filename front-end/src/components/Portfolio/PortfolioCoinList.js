import { useState } from 'react';
import { ListGroup,Row, Col,Button} from 'react-bootstrap';
import upArrow from '../CoinList/up-arrow.png';
import downArrow from '../CoinList/down-arrow.png';
import SmallPriceChart from '../PriceChart/SmallPriceChart';
import PercChange from '../PercChange/PercChange';

const PortfolioCoinList = (props) => {
    const { coins , portfolioCoins } = props

    //merge arrays and sort them according to holdings
    
    const array = coins.map((value,index)=>{
        return ( {...value,...portfolioCoins[index]} );       
    });
    array.sort((a, b) => (a.holdings > b.holdings) ? -1 : 1)

    const [reverseCoins,setReverseCoins] = useState(false);
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
                                {coin.holdings}
                            </Col>
                            <Col >
                                {coin.sumPnLOfCoin}
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
                                {coin.holdings}
                            </Col>
                            <Col >
                                {coin.sumPnLOfCoin}
                            </Col>
                            
                        </Row>
                    </ListGroup.Item>
                )).reverse()
            )
        }
        
    }


    return (

        <ListGroup variant="flush">
            {topInfo()}
            {coinsMap()}
        </ListGroup>
    )
}

export default PortfolioCoinList;
