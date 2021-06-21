import React,{useState,useEffect,useContext} from 'react';
import { useParams } from "react-router"; 
import {Container,Row,Col,ListGroup,ListGroupItem,Button,Modal} from 'react-bootstrap';
import AddCoinModal from '../modals/portfolioModals/addCoin';
import axios from 'axios';
import CurrencyContext from '../../context/currency/currencyContext';
import AuthContext from '../../context/auth/authContext';
import NotFound from '../NotFound/NotFound';
import Spinner from '../Spinner/Spinner';
import { Fragment } from 'react';



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
    
    const loadUsersPortfolio = async() => {
        if(isAuthenticated){
            //users details is in user
            loadUser();
            try{
                const res = await axios.get(('/portfolios/'+pname));
                 console.log(res.data);
                 setPortfolio(res.data);
                
            }catch(e){
                console.log(e.response);
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
               console.log("tyty");             
            }
        }catch(e){
            console.log(e);
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
                            <Button variant="outline-danger">Remove Coin</Button>{' '}
                            
                        </Col>
                        </Row>
                        <Row>
                            <Col>
                            {portfolio.coins.map((coin)=>(
                                <>
                                    {coin.coinId}<br/>
                                </>
                            
                            ))}
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