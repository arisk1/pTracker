import React , { useEffect,Fragment, useContext, useState } from 'react';
import CurrencyContext from '../../context/currency/currencyContext';
import AuthContext from '../../context/auth/authContext';
import axios from 'axios';
import {Container,Row,Col,ListGroup,ListGroupItem,Button,Modal} from 'react-bootstrap';
import LogIn from '../LogIn/logIn.js';
import SignUp from '../SignUp/signUp.js';
import rightArrow from './right.png';
import PortfolioModal from '../modals/portfolioModals/addPortfolio.js';
import WarningModal from '../modals/portfolioModals/warningModal';
import RenameModal from '../modals/portfolioModals/renameModal';
import { Link} from 'react-router-dom';
import PortfolioSpecs from '../PortfolioSpecs/PortfolioSpecs';
import Spinner from '../Spinner/Spinner';




const Portfolio = (props) => {

    //auth contect
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loadUser, user } = authContext;
    //currency context
    const currencyContext = useContext(CurrencyContext);
    const {currency} = currencyContext;  

    const [portfolios , setPortfolios] = useState([]);
    const [sumPortfolios,setSumPortfolios] = useState({});

    const calculatePortfolioSums = (portfs) => {
        //if portfolio is an array of portfolios 
        //calculate the sum of them
        // sum of portfolios ,sum position, sumofPortfolioschange , sumofpnl , sum of coins
        let sumofp = 0;let sumofpc = 0;let sumofpnl = 0;let sumofc = 0;let sumofpos = 0;
        portfs.forEach((portf)=>{
            sumofp +=  portf.sumOfPortfolio;
            sumofpos +=  portf.sumPosition;
            sumofpc += portf.portfolioChange;
            sumofpnl +=  portf.sumPnL
            sumofc +=  (portf.coins).length
        })
        setSumPortfolios({
            sumPosition : sumofpos,
            sumOfPortfolio : sumofp,
            portfolioChange : sumofpc,
            sumPnL : sumofpnl,
            numOfCoins : sumofc
        })        
    }

    const percChangeCalc = (pnl , position ) => {
        if(pnl < 0){
            let x = (100*(-1*pnl)) / position;
            return (-1*x) 
        }else{
            let x = (100*pnl)/position;
            return x
        }
    }

    const AllPortfolios = () => {
        if(portfolios.length > 0 ){
            if(Object.keys(sumPortfolios).length === 0){
                return (<Spinner/>)
            }else{
                return (<PortfolioSpecs portfolio={sumPortfolios} currency={currency} percChangeCalc={percChangeCalc} numOfCoins={sumPortfolios.numOfCoins}/>)  
            }  
        }else{
            return(<Fragment/>)
        }
    }
    
    const updateItem =(index,newvalue)=> {
        //we use this to add the new portfolio to the list 
        //so we dont need to load it from the database
        let g = portfolios[index]
        g.name = newvalue
        if (index === -1){
          // handle error
          console.log('no match')
        }
        else
        setPortfolios([
            ...portfolios.slice(0,index),g,...portfolios.slice(index+1)]
        );
      }


    const loadPortfolio = async() => {
        if(isAuthenticated){
            //users details is in user
            loadUser();
            try{
                const res = await axios.get('/portfolios');
                // console.log(res.data);
                setPortfolios(res.data);
                calculatePortfolioSums(res.data);
            }catch(e){
                console.log(e);
            }
        }
    }

    const deletePortfolio = async(portfolioId) => {
        if(isAuthenticated){
            //users details is in user
            loadUser();
            try{
                const res = await axios.delete(('/portfolios/' + portfolioId));
                if(res.status === 200){
                    //setPortfolios(portfolios.filter(portfolio => {return portfolio._id != portfolioId}))
                    loadPortfolio();
                }
            }catch(e){
                console.log(e);
            }
        }
    }

    const renamePortfolio = async(portfolioId,newName,idx) => {
        if(isAuthenticated){
            //users details is in user
            loadUser();
            try{
                const res = await axios.patch(('/portfolios/' + portfolioId + '/rename'), {
                    name : newName
                });
                if(res.status === 200){
                    updateItem(idx,newName);                    
                }
            }catch(e){
                console.log(e);
            }
        }
    }

    

    const NotAuthenticated = () => {
        return(
            <Container>
            <Row className='row-top mr-0 ml-0'  >
                <Col style={{backgroundColor: "lightblue", textAlign : 'left'}}>
                    <Row className='inside-row-top-header mr-0 ml-0' >
                        <Col>
                            <p style={{padding : '25px',marginBottom : '0px'}} >
                            <h1 className='mb-0' style={{fontWeight : 'bold'}}>Personalized Portfolio</h1>
                            Keep track of your expenses,profit and loss during different time frames.
                            </p>
                        </Col>
                    </Row>
                    <Row className='mr-0 ml-0 pb-0'>
                    <Col className='row-button'>
                        <p style={{paddingLeft : '25px',marginBottom : '0px',fontWeight : 'bold'}} >
                        <SignUp/>
                        to create your personalized portfolio
                        </p>
                        </Col>
                    </Row>
                    <Row className='mr-0 ml-0'>
                        <Col>
                       
                        </Col>
                    </Row>
                    <Row className='mr-0 ml-0'>
                        <Col >
                        <p style={{paddingLeft : '25px',fontSize : '13px'}} >
                        If you are already a member of our community
                        <LogIn variant="link" class="mr-sm-2"/>
                       
                        </p>
                        </Col>
                    </Row>
                </Col>
                <Col style={{backgroundColor: "grey"}}>
                    some intresting text 
                </Col>
            </Row>
            </Container>
        
        )
    }

    const Authenticated = () => {
        return(
            <Container>
                <Row className='row-top mr-0 ml-0' >
                    <Col>
                        <h1 style={{fontWeight : 'bold'}} >List of my Portfolios</h1>
                        <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <PortfolioModal updatePortfolio={loadPortfolio}  />
                        </ListGroup.Item>
                        <h3 style={{fontWeight : 'bold',textDecoration : 'underline'}} >Summary of my portfolios</h3>
                        <AllPortfolios />
                        <ListGroup.Item> 
                        {portfolios.length > 0 ? <Row>
                            <Col style={{fontWeight : 'bold', textDecoration : 'underline',fontSize : '25px'}}>Portfolio Name</Col>
                            <Col style={{fontWeight : 'bold', textDecoration : 'underline',fontSize : '25px'}}>Value Of Portfolio</Col>
                            <Col></Col>
                        </Row> : 
                        <Fragment>
                        <Row>
                            <Col>
                                <h3>It appears you have not created a portfolio yet.</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h3>What are you waiting for?Get started right now by clicking the plus button above!</h3>
                            </Col>
                        </Row>  
                        </Fragment>
                        }
                        
                        </ListGroup.Item>
                        {
                        portfolios.map((portfolio,idx) => (
                            <ListGroup.Item key={idx} >
                                <Row className="align-items-center" style={{fontSize : '20px'}} >
                                    <Col>
                                        <img
                                        alt="rightArrow-logo"
                                        src={rightArrow}
                                        width="20"
                                        height="20"
                                        className="d-inline-block align-middle"/>
                                        {portfolio.name}
                                    </Col> 
                                    <Col >{(portfolio.sumOfPortfolio).toLocaleString()}{' '}{currency.toUpperCase()}</Col>
                                    <Col >
                                        <Button as={Link} to={{pathname:`/portfolio/${portfolio._id}`}} variant="outline-primary" > View Details </Button>{' '}
                                        <WarningModal name={portfolio.name} deletePortfolio={deletePortfolio} pid={portfolio._id} />{' '}
                                        <RenameModal renamePortfolio={renamePortfolio} pid={portfolio._id} pidx={idx} />  
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))
                        }</ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }

    useEffect(() => {
        loadPortfolio();
        // eslint-disable-next-line    
        },[isAuthenticated])

    return ( 
        <Fragment> 
            {isAuthenticated ? <Authenticated/> : <NotAuthenticated/> }
        </Fragment>)

}

export default Portfolio;