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
import CoinList from '../CoinList/CoinList';
import  {coinListMarkets } from '@arisk1/cg-functions';



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
    
    const loadUsersPortfolio = async() => {
        if(isAuthenticated){
            //users details is in user
            loadUser();
            try{
                const res = await axios.get(('/portfolios/'+pname));
                setPortfolio(res.data);
                if(res.data.coins.length > 0 ){
                    const resCoins = await coinListMarkets(localStorage.currency,res.data.coins.map((coin)=>(coin.coinId)),'market_cap_desc',1, true,100);
                    setCoins(resCoins.data);
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
               loadUsersPortfolio();         
            }
        }catch(e){
            console.log(e);
        }
    }

    const fetchData = async() => {
        // make an array with coins of the portfolio
        const res = await coinListMarkets(localStorage.currency,portfolio.coins.map((coin)=>(coin.coinId)),'market_cap_desc',1, true,100);
        setCoins(res.data);
    }

    const CoinList2 = () => {
        if(coins.length > 0 ){
            return(<CoinList  coins={coins}/> )
        }else{
            return (<Fragment  >You have not added coins to your portoflio yet <br/>
                                Start now by clicking the Add Coin button.
            </Fragment>)
        }
    }

    useEffect(() => {
        loadUsersPortfolio();
        // eslint-disable-next-line    
        },[isAuthenticated])


   
   

   
    return(
        <Fragment>
        {notfound ? <NotFound /> : <Container>
            {Object.entries(portfolio).length === 0 ? <Spinner /> : 
                <Row className='row-top mr-0 ml-0' >
                    <Col>
                        <Row>
                        <Col style={{textAlign : 'left'}}>
                            <h3> {portfolio.name} </h3>
                        </Col>
                        <Col style={{textAlign : 'right'}}>
                            <AddCoinModal addCoin={addCoin} pid={portfolio._id} />
                            <RemoveCoinModal removeCoin={removeCoin} pid={portfolio._id} />
                            
                        </Col>
                        </Row>
                        <Row>
                            <Col style={{paddingTop : '50px'}} >
                                <CoinList2   />
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