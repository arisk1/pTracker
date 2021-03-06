import { useState,useEffect } from 'react';
import { ListGroup,Row, Col,Button} from 'react-bootstrap';
import upArrow from '../CoinList/up-arrow.png';
import downArrow from '../CoinList/down-arrow.png';
import SmallPriceChart from '../PriceChart/SmallPriceChart';
import PercChange from '../PercChange/PercChange';
import PortfolioSpecs from '../PortfolioSpecs/PortfolioSpecs';
import AddTransaction from '../modals/portfolioModals/addTransaction';
import context from 'react-bootstrap/esm/AccordionContext';
import axios from 'axios';
import TransactionHistory from '../TransactionHistory/TransactionHistory';
import { Link } from "react-router-dom"; 
import  {exchangeRates} from '@arisk1/cg-functions';
import Spinner from '../Spinner/Spinner';
import { Fragment } from 'react';


const PortfolioCoinList = (props) => {
    const { coins , portfolioCoins ,currency,portfolio,loadPortfolio,calculateCurrency,convertToUsd,currencyR,btcExRate,vsCurrencies } = props

    //merge arrays and sort them according to holdings
    
    const array = coins.map((value,index)=>{
        //match the id of coins array with the coinId of portfolioCoins
        let myindex=0;
        portfolioCoins.forEach((c,idx) => {
            if(value.id === c.coinId){
                myindex=idx;
            }
        });
        return({...value,...portfolioCoins[myindex]})
    });
    array.sort((a, b) => (a.holdings > b.holdings) ? -1 : 1)//desc

    const [reverseCoins,setReverseCoins] = useState(false);    

    const addTransactionFunction = async (typeOfTransaction , coin , quantity , pricePerCoin , date) => {
        try{
            const res = await axios.patch(('/portfolios/' + portfolio._id + '/transaction'), {
                typeOfTransaction : typeOfTransaction, 
                coin : coin,
                quantity : quantity,
                //whatever the currency is we need to convert it to usd before storing it to the database
                pricePerCoin : convertToUsd(pricePerCoin),
                date : date
            });
            if(res.status === 200){
                loadPortfolio();
            }
        }catch(e){
            console.log(e);
        }
    }

    const percentage = (sum,holdings) => {
        if(holdings === 0 && sum === 0){
            return ("0%") 
        }else{
            const perc = (100*holdings) / sum;
            return (perc.toFixed(3) +"%");
        }
       
    }


    const percChangeCalc = (pnl , position ) => {
        if(position === 0){
            return 0
        }
        else if(pnl < 0){
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
                        <Col>
                                Actions
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
                            <Col style={{textAlign: 'left',fontSize : '12px'}}>
                                <img alt={coin.id} className="img" src={coin.image}/><Link style={{ color: '#000',fontWeight : 'bold' }} to={{pathname:`/coins/${coin.id}`}} >{coin.name}</Link>
                            </Col>
                            <Col>{(coin.current_price).toLocaleString()}{' '}{currency}</Col>
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
                                    width={100}
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
                                        {calculateCurrency(coin.holdings).toLocaleString()}{' '}{currency}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {percentage(portfolio.sumOfPortfolio,coin.holdings)}
                                    </Col>
                                </Row>
                            </Col>
                            <Col >
                                <Row>
                                    <Col>
                                        {calculateCurrency(coin.sumPnLOfCoin).toLocaleString()}{' '}{currency}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <PercChange perc_change={percChangeCalc(coin.sumPnLOfCoin,coin.sumPositionOfCoin)} />
                                    </Col>
                                </Row>
                               
                            </Col>
                            <Col >
                                <Row>
                                    <Col>
                                        <AddTransaction vsCurrencies={vsCurrencies} currencyR={currencyR} btcExRate={btcExRate} coin={coin} addTransaction={addTransactionFunction} currency={currency} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button as={Link} to={{pathname:`/portfolio/${portfolio._id}/history/${coin.id}`}} variant="link" style={{fontSize : '12px'}}>View History</Button>
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
                            <Col style={{textAlign: 'left',fontSize : '12px'}}>
                                <img alt={coin.id} className="img" src={coin.image}/><Link style={{ color: '#000',fontWeight : 'bold' }} to={{pathname:`/coins/${coin.id}`}} >{coin.name}</Link>
                            </Col>
                            <Col>{(coin.current_price).toLocaleString()}{' '}{currency}</Col>
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
                                    {calculateCurrency(coin.holdings).toLocaleString()}{' '}{currency}
                                    </Col>
                                </Row>
                            </Col>
                            <Col >
                            <Row>
                                    <Col>
                                        {calculateCurrency(coin.sumPnLOfCoin).toLocaleString()}{' '}{currency}
                                    </Col>
                                </Row><Row>
                                    <Col>
                                    <PercChange perc_change={percChangeCalc(coin.sumPnLOfCoin,coin.sumPositionOfCoin)} />
                                    </Col>
                                </Row>
                               
                            </Col>
                            <Col >
                                <Row>
                                    <Col>
                                       <AddTransaction vsCurrencies={vsCurrencies} currencyR={currencyR} btcExRate={btcExRate} coin={coin} addTransaction={addTransactionFunction} currency={currency} />
                                    </Col>
                                </Row>
                                <Row>
                                <Col>
                                <Button as={Link} to={{pathname:`/portfolio/${portfolio._id}/history/${coin.id}`}} variant="link" style={{fontSize : '12px'}}>View History</Button>
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
        <ListGroup variant="flush"> 
            <PortfolioSpecs portfolio={portfolio} calculateCurrency={calculateCurrency} currency={currency} percChangeCalc={percChangeCalc} numOfCoins={(portfolio.coins).length}/>
            {topInfo()}
            {coinsMap()} 
        </ListGroup>
    )
}

export default PortfolioCoinList;
