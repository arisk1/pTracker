import axios from 'axios';
import React , {useEffect, useState} from 'react';

function Home() {
    const [coins,setCoins] = useState([]);

    const fetchData = async() => {
        const res = await axios.get('http://localhost:3001/home');
        setCoins(res.data);
    }
    useEffect(()=>{
        fetchData();
    })
    return(
        <ul>
        {coins.map(coin => (
            <li key={coin.id}>
                {coin.id}
            </li>
        ))}
        </ul>
    )
}

export default Home;