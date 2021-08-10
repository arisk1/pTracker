import React, {useEffect, useState, useContext, Fragment} from 'react';
import { useParams} from "react-router"; 
import {Container,Row,Col,ListGroup} from 'react-bootstrap';
import CurrencyContext from '../../context/currency/currencyContext';
import  {coinInfo,exchangeRates } from '@arisk1/cg-functions';
import Spinner from '../Spinner/Spinner';
import NotFound from '../NotFound/NotFound';

const CoinDetails = () => {

    let { coinid } = useParams();
    // context
    const currencyContext = useContext(CurrencyContext);
    const {currency} = currencyContext; 
    const [coin,setCoin] = useState({});
    const [btcExRateArray , setBtcExRateArray] = useState({});
    const [notfound , setNotFound] = useState(false);

    useEffect(() => {  
        const fetchData = async() => {
            try{
                const res2 = await coinInfo(coinid);
                const res = await exchangeRates();
                setCoin(res2.data);
                setBtcExRateArray(res.data.rates);
            }catch(e){
                if(e.response.status === 404){
                    setNotFound(true)
                }
            }
        }
        fetchData();
    },[])

    return(
        <Container>
            {notfound ? <NotFound /> :
            <Fragment>
            {( Object.keys(btcExRateArray).length === 0 || Object.keys(coin).length ===0 ) ? <Spinner /> 
                :<Fragment>
                    <Row style={{ border: '1px solid red',padding :'20px'}}>
                        <Col style={{fontSize : '35px',fontWeight : 'bold'}}>
                          <img alt={coin.id} className="coin-details-img" src={coin.image.large}/>{coin.name}
                        </Col>
                    </Row>
                    <Row  style={{ border: '1px solid red'}}>
                    <Col  >
                        <Row>
                            <Col style={{padding : '10px'}}>
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px'}} >Market Cap Rank : #{coin.market_cap_rank} </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',fontSize : '25px'}}>
                                Current Price : {coin.market_data.current_price[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',fontSize : '15px'}}>
                                <Row>
                                    <Col>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                Market Cap :<br/> {coin.market_data.market_cap[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}
                                            </ListGroup.Item>
                                            { Object.keys(coin.market_data.fully_diluted_valuation).length !== 0 ? 
                                                <ListGroup.Item>
                                                Fully Diluted Valuation :<br/> {coin.market_data.fully_diluted_valuation[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}
                                            </ListGroup.Item>
                                            :null}
                                            <ListGroup.Item>
                                            24 Hour Trading Vol :<br/> {coin.market_data.total_volume[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col>
                                    <ListGroup variant="flush">
                                            <ListGroup.Item>
                                                Circulating Supply :<br/> {coin.market_data.circulating_supply.toLocaleString()}
                                            </ListGroup.Item>
                                            { coin.market_data.total_supply !== null ? 
                                                <ListGroup.Item>
                                                    Total Supply :<br/> {coin.market_data.total_supply.toLocaleString()}
                                                </ListGroup.Item> 
                                            :  <ListGroup.Item>
                                                Total Supply :<br/> {'∞'}
                                                </ListGroup.Item>
                                            }
                                            { coin.market_data.max_supply !== null ? 
                                                <ListGroup.Item>
                                                    Max Supply :<br/> {coin.market_data.max_supply.toLocaleString()}
                                                </ListGroup.Item>
                                            :null}
                                        </ListGroup>
                                    </Col>
                                </Row>                           
                            </Col>
                        </Row>
                    </Col>
                    <Col  style={{ border: '1px solid red'}}>
                        explores <br/>
                        contact adress <br/>
                        ... <br/>
                    </Col>
                    <Col  style={{ border: '1px solid red'}}>
                        markets
                    </Col>
                    </Row>
                    <Row  style={{ border: '1px solid red'}}>
                        <Col>
                            chart
                        </Col>
                    </Row>
                    </Fragment>
                }
                </Fragment>
            }
           
        </Container>
    )
}

export default CoinDetails