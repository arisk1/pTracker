import axios from 'axios';
import React , {useEffect, useState} from 'react';
import {Container, ListGroup, ListGroupItem,Row,Col} from 'react-bootstrap';
import CoinList from '../CoinList/CoinList';


function Home() {
    const [coins,setCoins] = useState([]);

    const fetchData = async() => {
        const res = await axios.get('http://localhost:3001/home');
        setCoins(res.data);
    }
    
    useEffect(()=>{
        fetchData();
    },[])
    return(
        <div>
            {CoinList(coins)}
        </div>
    )
}

export default Home;