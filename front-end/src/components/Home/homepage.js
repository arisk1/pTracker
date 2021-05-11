import axios from 'axios';
import React, {useEffect, useState, useContext} from 'react';
import CoinList from '../CoinList/CoinList';
import {Button,ButtonGroup,ListGroup,Col,Row} from 'react-bootstrap';
import AuthContext from '../../context/auth/authContext';
import CurrencyContext from '../../context/currency/currencyContext';


const Home = () => {
    // context
    const authContext = useContext(AuthContext);

    const currencyContext = useContext(CurrencyContext);
    const {currency} = currencyContext;  
   
    const [coins,
        setCoins] = useState([]);
    const [pageIndex,
        setPageIndex] = useState(1);
    
    
    const pageHandleUp = () => {
        setPageIndex(pageIndex + 1);
    }

    const pageHandleDown = () => {
        setPageIndex(pageIndex - 1);
    }

    useEffect(() => {
        // load user where component loads
        authContext.loadUser();
        // eslint-disable-next-line
    }, [])

    
    useEffect(() => {
        
        const fetchData = async() => {
            const res = await axios.post('/home',{
                "currency" : currency,
                "order" : 'market_cap_desc' ,
                "pageIndex" : pageIndex
            });
            setCoins(res.data);
        }
        fetchData();
    },[currency,pageIndex])
    
    return (
        <div>
            <ListGroup variant="flush">
                <ListGroup.Item style={{backgroundColor: '#C0C0C0',borderBottom : '1px solid grey'}}>     
                    <Row>
                        <Col style={{textAlign: 'left'}}>  
                            <ButtonGroup >
                                <Button variant="dark"  >Currency : {(currency).toUpperCase()}</Button>
                            </ButtonGroup>
                        </Col>
                        <Col style={{ textAlign: 'right'}}>  
                            <ButtonGroup >
                                {pageIndex === 1 ? <Button variant="dark" disabled >&lt;</Button>  : <Button variant="dark" onClick={pageHandleDown}  >&lt;</Button>}
                                <Button variant="dark" onClick={pageHandleUp}  >&gt;</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            <CoinList coins={coins} />
        </div>
    )
}

export default Home;