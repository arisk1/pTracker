import React,{useState,useEffect,useContext} from 'react';
import { useParams } from "react-router"; 
import {Container,Row,Col,ListGroup,ListGroupItem,Button,Modal} from 'react-bootstrap';
import AddCoinModal from '../modals/portfolioModals/addCoin';
import RemoveCoinModal from '../modals/portfolioModals/removeCoin';
import axios from 'axios';
import CurrencyContext from '../../context/currency/currencyContext';
import AuthContext from '../../context/auth/authContext';
import NotFound from '../NotFound/NotFound';
import Spinner from '../Spinner/Spinner';
import { Fragment } from 'react';
import  {coinListMarkets,exchangeRates} from '@arisk1/cg-functions';
import PortfolioCoinList from './PortfolioCoinList'
import GoBack from '../goBack/GoBack';
import PieChart from '../PieChart/PieChart';
import chart from './chart.png';



const PortfolioDetails = () => {

    let { pname } = useParams();
       
    //auth context
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loadUser, user } = authContext;
    //currency context
    const currencyContext = useContext(CurrencyContext);
    const {currency} = currencyContext; 

    const [portfolio, setPortfolio] = useState({});
    const [notfound , setNotFound] = useState(false);
    const [coins , setCoins] = useState([]);
    const [btcExRateArray , setBtcExRateArray] = useState({});
    const [loadingSpinner , setLoadingSpinner] = useState(true);
    const [show, setShow] = useState(false);


    const loadUsersPortfolio = async() => {
        if(isAuthenticated){
            //users details is in user
            loadUser();
            try{
                const res = await axios.get(('/portfolios/'+pname));
                setPortfolio(res.data);
                if(((res.data).coins).length > 0 ){
                    const resCoins = await coinListMarkets(localStorage.currency,((res.data).coins).map((coin)=>(coin.coinId)),'market_cap_desc',1, true,100);
                    setCoins(resCoins.data);
                    setLoadingSpinner(false);
                }
            }catch(e){
                console.log(e)
                if(e.response.status === 404){
                    setNotFound(true)
                }
            }
        }
    }
    

    const addCoin = async(coinName,portfolioId) => {
        try{
            const res = await axios.patch(('/portfolios/' + portfolioId + '/add'), {
                coinName : coinName
            });
            if(res.status === 200){
               loadUsersPortfolio();         
            }
        }catch(e){
            console.log(e);
        }
    }

    const removeCoin = async(coinName,portfolioId) => {
        try{
            const res = await axios.patch(('/portfolios/' + portfolioId + '/remove'), {
                coinName : coinName
            });
            if(res.status === 200){
                console.log(coins)
                loadUsersPortfolio();   
                setCoins(coins.filter(coin => {return coin.id !== coinName}))
      
            }
        }catch(e){
            console.log(e);
        }
    }

    const CoinList2 = () => {
        if(portfolio.coins.length > 0 ){
            return(
                <Fragment>
                    { loadingSpinner ? <Spinner/> : <PortfolioCoinList coins={coins} calculateCurrency={calculateCurrency} portfolioCoins={portfolio.coins} currency={btcExRateArray[currency].unit} portfolio={portfolio} loadPortfolio={loadUsersPortfolio} />   }
                </Fragment>
            )
        }else{
            return (<Fragment  >You have not added coins to your portoflio yet <br/>
                                Start now by clicking the Add Coin button.
            </Fragment>)
        }
    }

    const fetchExchangeRateData =async () => {
        const res = await exchangeRates();
        setBtcExRateArray(res.data.rates);
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

    const ShowPie = () => {
        if(show === true){
            return (<PieChart coins={coins} portfolioCoins={portfolio.coins} calculateCurrency={calculateCurrency} /> );
        }else{
            return (null);
        }
    }

    useEffect(()=>{
        fetchExchangeRateData();
    },[])
    

    useEffect(() => {
        loadUsersPortfolio();
        // eslint-disable-next-line    
        },[isAuthenticated,currency])
        
    return(
        <Fragment>
        {notfound ? <NotFound /> : <Container>
            
            {Object.entries(portfolio).length === 0 ? <Spinner /> : 
                <Row className='row-top mr-0 ml-0' >
                    <Col>
                        <GoBack buttonText={"Back to Portfolios' Dashboard "} pathTo={"/portfolio"} />
                        <Row>
                            <Col style={{textAlign : 'left'}}>
                                <h3> <span style={{color : 'grey'}}>Portfolio's name:</span> {portfolio.name} </h3>
                            </Col>
                            <Col style={{textAlign : 'right'}}>
                               <AddCoinModal addCoin={addCoin} pid={portfolio._id} />
                               <RemoveCoinModal removeCoin={removeCoin} pid={portfolio._id} coins={coins} />  
                            </Col>
                        </Row>
                        <Row >
                            <Col style={{textAlign : 'left'}}>
                                <Button variant='outline-primary'  onClick={()=>setShow(!show)} type="button">
                                <img
                                    alt="chart-logo"
                                    src={chart}
                                    width="20"
                                    height="20"
                                    className="img"/>Show Pie Chart
                                </Button>
                            </Col>
                            <Col>
                                <ShowPie />
                            </Col>
                            <Col></Col>
                        </Row>
                        <Row>
                            <Col >
                                <CoinList2 />
                            </Col>
                        </Row>
                        
                    </Col>
                </Row>
               
            }
            </Container>  }
            </Fragment>
            
        
    )
}

export default PortfolioDetails;