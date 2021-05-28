import React , { useEffect,Fragment, useContext, useState } from 'react';
import CurrencyContext from '../../context/currency/currencyContext';
import AuthContext from '../../context/auth/authContext';
import axios from 'axios';
import {Container,Row,Col} from 'react-bootstrap';
import LogIn from '../LogIn/logIn.js';
import SignUp from '../SignUp/signUp.js';


const Portfolio = (props) => {

    //auth contect
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loadUser, user } = authContext;
    //currency context
    const currencyContext = useContext(CurrencyContext);
    const {currency} = currencyContext;  

    const [portfolioName , setPortfolioName] = useState("temp");

    const loadPortfolio = async() => {
        if(isAuthenticated){
            //users details is in user
            loadUser();
            //we user loadUser to set the new AuthToken
            try{
                const res = await axios.get('/portfolios');
                console.log(res.data);
                setPortfolioName(res.data[0].name)
            }catch(e){
                console.log(e);
            }
        }
    }

    const NotAuthenticated = () => {
        return(
            <Row className='row-top' >
                <Col style={{backgroundColor: "lightblue"}}>
                    <Row className='inside-row-top-header' >
                        <Col>
                        <h1>Ptracker's Portfolio</h1>
                            if you want to see your portfolio
                        </Col>
                    </Row>
                    <Row>
                    <Col className='row-button'>
                            <LogIn />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                             if you are not a member of your community yet
                        </Col>
                    </Row>
                    <Row>
                        <Col className='row-button'>
                            <SignUp/>
                        </Col>
                    </Row>
                </Col>
                <Col style={{backgroundColor: "grey"}}>
                    some intresting text 
                </Col>
            </Row>
        )
    }

    useEffect(() => {
        loadPortfolio();
    },[isAuthenticated])

    return ( 
        <Container> 
            {isAuthenticated ? <h1>i am authenticated , portfolio name : {portfolioName}</h1> : <NotAuthenticated/> }
        </Container>)

}

export default Portfolio;