import { useState } from 'react';
import { ListGroup,Row, Col,Button} from 'react-bootstrap';
import upArrow from './up-arrow.png';
import downArrow from './down-arrow.png';
import SmallPriceChart from '../PriceChart/SmallPriceChart';

const CoinList = (props) => {
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
        if (props.coins.length > 0) {
            return (
                <ListGroup.Item
                    style={{
                    backgroundColor: '#C0C0C0'
                }}>
                    <Row >
                        <Col
                            style={{
                            textAlign: 'left'
                        }}>#</Col>
                        <Col>Symbol</Col>
                        <Col>Coin</Col>
                        <Col>Price</Col>
                        <Col as={Button}
                        className='px-15 py-0 hover-mc'
                        variant=""
                        onClick={()=>setReverseCoins(!reverseCoins)}>
                            <ArrowToggle/>
                            MarketCap
                        </Col>
                        <Col>
                            Chart
                        </Col>
                    </Row>
                </ListGroup.Item>
            )
        }
    }

    const coinsMap = () => {
        if(!reverseCoins){
            return(
                props.coins.map((coin,idx) => (
                    <ListGroup.Item key={idx} >
                        <Row className="align-items-center">
                            <Col
                                style={{
                                textAlign: 'left'
                            }}>{coin.market_cap_rank}</Col>
                            <Col><img alt={coin.id} className="img" src={coin.image}/></Col>
                            <Col>{coin.name}</Col>
                            <Col>{coin.current_price}</Col>
                            <Col>
                            {coin.market_cap}
                            </Col>
                            <Col>
                                <SmallPriceChart />
                            </Col>
                        </Row>
                    </ListGroup.Item>
                ))
            )
        }else{
            return(
                props.coins.map((coin,idx) => (
                    <ListGroup.Item key={idx} >
                        <Row className="align-items-center">
                            <Col
                                style={{
                                textAlign: 'left'
                            }}>{coin.market_cap_rank}</Col>
                            <Col><img alt={coin.id} className="img" src={coin.image}/></Col>
                            <Col>{coin.id}</Col>
                            <Col>{coin.current_price}</Col>
                            <Col
                                style={{
                                textAlign: 'right'
                            }}>
                            {coin.market_cap}
                            </Col>
                            <Col>
                                <SmallPriceChart />
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

export default CoinList;
