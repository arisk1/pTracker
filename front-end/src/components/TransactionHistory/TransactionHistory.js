import React,{useState,useEffect,useContext,Fragment} from 'react';
import { Modal, Button, Form,Row,Col,ListGroup } from 'react-bootstrap';
import { useParams } from "react-router"; 
import GoBack from '../goBack/GoBack';
import CurrencyContext from '../../context/currency/currencyContext';
import AuthContext from '../../context/auth/authContext';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import {coinInfo}  from '@arisk1/cg-functions';
import TransactionSpecs from './TransactionSpecs';
import {exchangeRates} from '@arisk1/cg-functions';




const TransactionHistory = () => {

    const {pname , coinid} = useParams()

    const [portfolio, setPortfolio] = useState({});
    const [history , setHistory] = useState([]);
    const [coinInformation, setCoinInformation] = useState({});
    const [coinObject,setCoinObject] = useState({});
    const [btcExRateArray , setBtcExRateArray] = useState({});
    const [loading,setLoading] = useState(true);


    //auth context
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loadUser, user } = authContext;
    //currency context
    const currencyContext = useContext(CurrencyContext);
    const {currency} = currencyContext; 

    const loadUsersPortfolio = async() => {
        if(isAuthenticated){
            //users details is in user
            loadUser();
            try{
                const res = await axios.get(('/portfolios/'+pname));
                setPortfolio(res.data);
                (res.data.coins).forEach(coinHistory => {
                    if(coinHistory.coinId === coinid){
                        setHistory(coinHistory.history);
                        setCoinObject(coinHistory)
                    }
                } 
                )
            }catch(e){
                console.log(e)
            }
        }
    }

    const fetchData = async() => {
        const resdata = await coinInfo(coinid);
        console.log(resdata.data)
        setCoinInformation(resdata.data);
    }

    const colorResults = (transaction,result) => {
        if(transaction === 'buy' || transaction === 'transferin'){
            return (<Col style={{color : 'green'}} >
            {"+" + result }
        </Col>)
        }else if(transaction === 'sell'|| transaction === 'transferout'){
            return (<Col style={{color : 'red'}} >
            {"-" + result}
        </Col>)
        }
        if(result === 'buy'){
            return (<Col style={{color : 'green'}} >
            {result}
        </Col>)
        }else if(result === 'sell'){
            return (<Col style={{color : 'red'}} >
            {result}
        </Col>)
        }else if(result === 'transferin'){
            return (<Col style={{color : 'green'}} >
            {"Transfer In"}
        </Col>)
        }else if(result === 'transferout'){
            return (<Col style={{color : 'red'}} >
            {"Transfer Out"}
        </Col>)
        }
        if(result < 0) {
            return (<Col style={{color : 'red'}} >
                {result} <span style={{color : 'black'}}> {btcExRateArray[currency].unit} </span>
            </Col>)
        }else if(result > 0){
            return (<Col style={{color : 'green'}} >
                {result} <span style={{color : 'black'}}> {btcExRateArray[currency].unit} </span>
            </Col>)
        }else{
            return (<Col>
                {result}
            </Col>)
        }
    }

    const topInfo = () => {
        if (history.length > 0) {
            return (
                <ListGroup.Item
                    style={{
                    backgroundColor: '#C0C0C0'
                }}>
                    <Row className="text-bold">
                    <Col>
                                Transaction
                        </Col>
                        <Col>
                                Price
                        </Col>
                       
                        <Col>
                                Quantity
                        </Col>
                        <Col>
                                Date(yyyy/mm/dd)
                        </Col>
                        <Col>
                                Cost
                        </Col>
                        <Col>
                                Proceeds
                        </Col>
                        <Col>
                                Pnl
                        </Col>
                       
                    </Row>
                </ListGroup.Item>
            )
        }
    }

    const checkHistory = () => {
        if(history.length === 0){
            return false
        }else{
            return true
        }
        
    }

    const parseISODate = (dateIso) => {
        console.log(dateIso)
        const x = new Date(dateIso)
        return x.getFullYear()+ ' / ' + (x.getMonth()+1) + ' / '+x.getDate() + ' - ' + x.toLocaleTimeString() ;
    }

    const HistoryList = () => {
        return (
            <ListGroup variant="flush" > 
            {Object.entries(portfolio).length === 0 || loading ? <Spinner /> :  
                <Fragment>
                {checkHistory() ? 
                    <Fragment>
                        {Object.entries(coinObject).length === 0 ? <Spinner /> : <TransactionSpecs history={history} balance={coinObject.holdings} coinPnl={coinObject.sumPnLOfCoin} quantity={coinObject.quantity} calculateCurrency={calculateCurrency} currency={btcExRateArray[currency].unit}/>  }
                        {topInfo()}
                        {console.log(coinObject)}
                        {history.map((his,idx) => (
                            <ListGroup.Item key={idx}>
                            <Row className='align-items-center' >
                                {colorResults(" ",his.transaction)}
                                <Col>
                                    {(calculateCurrency(his.price)).toFixed(4)}{' '}{btcExRateArray[currency].unit}
                                </Col> 
                                {colorResults(his.transaction,his.quantity)} 
                                <Col style={{fontSize : '12px'}}>
                                    {parseISODate(his.date)}
                                </Col> <Col>
                                    {(calculateCurrency(his.cost)).toFixed(4)}{' '}{btcExRateArray[currency].unit}
                                </Col> <Col>
                                    {(calculateCurrency(his.proceeds)).toFixed(4)}{' '}{btcExRateArray[currency].unit}
                                </Col>
                                {colorResults(" ",(calculateCurrency(his.pnl)).toFixed(5))}
                            </Row>
                            </ListGroup.Item>
                            )
                        )} 
                </Fragment> : <Fragment>No past transactions found!</Fragment>
                }
                </Fragment>  
            }
            </ListGroup>
        )
    }

    const calculateCurrency = (portfoliosum) => {
        if(currency === 'usd'){
            //do nothing
            return portfoliosum;
        //calculate base on btc exchange rate
        }else {
            //first convert to btc 
            const res = portfoliosum / btcExRateArray['usd'].value;
            if(currency === 'btc'){
                return res;
            }else{
                //then to the desired currency
                const res2 = (btcExRateArray[currency].value)*res;
                return res2;
            } 
        }
    }

    const fetchExchangeRateData =async () => {
        const res = await exchangeRates();
        setBtcExRateArray(res.data.rates);
        setLoading(false);
    }

    

    useEffect(()=>{
        fetchExchangeRateData();
    },[])


    useEffect(() => {
        loadUsersPortfolio();
        fetchData();
        // eslint-disable-next-line    
        },[isAuthenticated,currency])
    
    return(

        
        <Row className='row-top mr-0 ml-0' >
        <Col>
            <GoBack buttonText={"Back to my portfolio "} pathTo={`/portfolio/${pname}`} />
            <Row>
                <Col style={{textAlign : 'left'}}>
                   <h3> <span style={{color : 'grey'}}>Portfolio's name:</span> {portfolio.name} </h3>
                </Col>
            </Row>
            <Row>
            
            {Object.entries(coinInformation).length === 0 ? <Spinner /> :  
                <Col style={{textAlign : 'left'}}>
                   <h3> <span style={{color : 'grey'}}>Crypto:</span> {coinInformation.name}<img alt={coinid} className='img-history' src={coinInformation.image.small}/>  </h3>
                   
                </Col>
            }
            </Row>
            
            <Row style={{paddingTop : '50px'}}>
                <Col >
                    
                    <HistoryList />
                   {console.log(history)}
                   {console.log(coinObject)}
                   {console.log(portfolio)}
                </Col>
            </Row>
            
        </Col>
    </Row>
    )
}

export default TransactionHistory