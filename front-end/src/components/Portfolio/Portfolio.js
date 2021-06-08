import React , { useEffect,Fragment, useContext, useState } from 'react';
import CurrencyContext from '../../context/currency/currencyContext';
import AuthContext from '../../context/auth/authContext';
import axios from 'axios';
import {Container,Row,Col,ListGroup,ListGroupItem,Button} from 'react-bootstrap';
import LogIn from '../LogIn/logIn.js';
import SignUp from '../SignUp/signUp.js';
import rightArrow from './right.png';


const Portfolio = (props) => {

    //auth contect
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loadUser, user } = authContext;
    //currency context
    const currencyContext = useContext(CurrencyContext);
    const {currency} = currencyContext;  

    const [portfolios , setPortfolios] = useState([]);
    const loadPortfolio = async() => {
        if(isAuthenticated){
            //users details is in user
            loadUser();
            //we user loadUser to set the new AuthToken
            try{
                const res = await axios.get('/portfolios');
                console.log(res.data);
                setPortfolios(res.data)
            }catch(e){
                console.log(e);
            }
        }
    }

    const addPortfolio = () => {
        console.log("Add a new portfolio");
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
                        <h1 >List of my Portfolios</h1>
                        <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Button onClick={()=> addPortfolio()} className="btn-circle" title="Add a new Portfolio to your list" variant="primary" size="lg" >+</Button>
                        </ListGroup.Item>
                        {
                        
                        portfolios.map((portfolio,idx) => (
                            <ListGroup.Item key={idx} >
                                <Row className="align-items-center" style={{fontSize : '27px'}} >
                                    <Col>
                                        <img
                                        alt="rightArrow-logo"
                                        src={rightArrow}
                                        width="20"
                                        height="20"
                                        className="d-inline-block align-middle"/>
                                        {portfolio.name}
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
    },[isAuthenticated])

    return ( 
        <Fragment> 
            {isAuthenticated ? <Authenticated/> : <NotAuthenticated/> }
        </Fragment>)

}

export default Portfolio;