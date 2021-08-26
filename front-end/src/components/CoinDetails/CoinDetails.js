import React, {useEffect, useState, useContext, Fragment} from 'react';
import { useParams} from "react-router"; 
import {Container,Row,Col,ListGroup} from 'react-bootstrap';
import CurrencyContext from '../../context/currency/currencyContext';
import  {coinInfo,coinList,exchangeRates,globalInfo } from '@arisk1/cg-functions';
import Spinner from '../Spinner/Spinner';
import NotFound from '../NotFound/NotFound';
import { Link} from 'react-router-dom';

const CoinDetails = () => {

    let { coinid } = useParams();
    // context
    const currencyContext = useContext(CurrencyContext);
    const {currency} = currencyContext; 
    const [coin,setCoin] = useState({});
    const [btcExRateArray , setBtcExRateArray] = useState({});
    const [globalInf,setGlobalInfo] = useState({});
    const [notfound , setNotFound] = useState(false);

    const normalizeUrl = (url) => {
        if(url.includes('https://')){
            const str1 = url.split('https://');
            if(str1[1].includes('www.')){
                const str2 = str1[1].split('www.');
                if(str2[1].includes('/')){
                    const str3 = str2[1].split('/');
                    return str3[0];
                }
                return str2[1];
            }
            if(str1[1].includes('/')){
                const str2 = str1[1].split('/');
                return str2[0];
            }
            if(str1[1].includes('.com')){
                const str2 = str1[1].split('.com')
                return str2[0]
            }
            return str1[1];
        }else{
            const str1 = url.split('http://');
            console.log(str1)
            if(str1[1].includes('www.')){
                const str2 = str1[1].split('www.');
                if(str2[1].includes('/')){
                    const str3 = str2[1].split('/');
                    return str3[0];
                }
                return str2[1];
            }
            if(str1[1].includes('/')){
                const str2 = str1[1].split('/');
                return str2[0];
            }
            if(str1[1].includes('.com')){
                const str2 = str1[1].split('.com')
                return str2[0]
            }
            return str1[1];
        }
       
    }

    const athPercChange = (athPerc) => {
        if(athPerc >=0){
            return(<span style={{color : 'green'}}>{athPerc} %</span>)
        }else{
            return(<span style={{color : 'red'}}>{athPerc} %</span>)
        }
    }

    const parseISODate = (dateIso) => {
        console.log(dateIso)
        const x = new Date(dateIso)
        return x.getFullYear()+ ' / ' + (x.getMonth()+1) + ' / '+x.getDate() + ' - ' + x.toLocaleTimeString() ;
    }

    const githubUrl = (gUrl) => {
        const newUrl =  gUrl.split("/");
        console.log(newUrl);
        const gNewUrl = "https://www.github.com/" + newUrl[3];
        return gNewUrl
    }

    const mCapDominance = (globalMcap , coinMcap) => {
        const percentage = (coinMcap*100)/globalMcap;
        return percentage.toFixed(2) + "%";
    }

    useEffect(() => {  
        const fetchData = async() => {
            try{
                const res2 = await coinInfo(coinid);
                const res = await exchangeRates();
                const res3 = await globalInfo();
                setCoin(res2.data);
                setGlobalInfo(res3.data);
                setBtcExRateArray(res.data.rates);
            }catch(e){
                if(e.response.status === 404){
                    setNotFound(true)
                }
            }
        }
        fetchData();
    },[])

    return(
        <Container>
            {notfound ? <NotFound /> :
            <Fragment>
            {( Object.keys(btcExRateArray).length === 0 || Object.keys(globalInf).length === 0  || Object.keys(coin).length ===0 ) ? <Spinner /> 
                :<Fragment>
                    <Row style={{ padding :'20px'}}>
                        <Col style={{fontSize : '35px',fontWeight : 'bold'}}>
                          <img alt={coin.id} className="coin-details-img" src={coin.image.large}/>{coin.name}
                        </Col>
                    </Row>
                    <Row>
                    <Col  style={{ border: '1px solid grey',borderRadius : '50px' ,margin : '5px',backgroundColor : '#ECECEC' }}>
                    <Row>
                            <Col style={{padding : '10px'}}>
                                <span style={{backgroundColor: "grey",borderRadius: '5px 5px 5px 5px',padding : '3px',fontWeight : 'bold',color : 'white'}} >Links & Info</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                Website 
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                                {coin.links.homepage.map((homepage)=>{
                                    if(homepage !== ""){
                                        return (<span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname:homepage}}  target="_blank">{normalizeUrl(homepage)}</Link></span>)
                                    }
                                })}                            
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                Explorers 
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left' , display : 'flex',flexWrap : 'wrap'}}>
                                {coin.links.blockchain_site.map((explorer)=>{
                                    if(explorer !== ""){
                                        return (<span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname:explorer}}  target="_blank">{normalizeUrl(explorer)}</Link></span>)
                                    }
                                })}
                            </Col>
                        </Row>
                        <Row>
                        <Col style={{padding : '10px',textAlign : 'right'}}>
                                Community 
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left',display : 'flex',flexWrap : 'wrap'}}>
                            {coin.links.official_forum_url.map((forum)=>{
                                    if(forum !== ""){
                                        return (<span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname:forum}} target="_blank">{normalizeUrl(forum)}</Link></span>)
                                    }
                            })}
                            {coin.links.twitter_screen_name !== null && coin.links.twitter_screen_name !== ""  ? 
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname: "https://twitter.com/" + coin.links.twitter_screen_name}}  target="_blank">Twitter</Link></span>
                            : null } 
                            {coin.links.facebook_username !== null && coin.links.facebook_username !== ""  ? 
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname: "https://www.facebook.com/" + coin.links.facebook_username}}  target="_blank">Facebook</Link></span>
                            : null } 
                            {coin.links.subreddit_url !== null && coin.links.subreddit_url !== ""  ? 
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname: coin.links.subreddit_url}}  target="_blank">Reddit</Link></span>
                            : null } 
                            </Col>
                        </Row>
                        <Row>
                        <Col style={{padding : '10px',textAlign : 'right'}}>
                                Source code 
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                            {coin.links.repos_url.github.length > 1 ? 
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname: githubUrl(coin.links.repos_url.github[0])}}  target="_blank">Github</Link></span>
                            : "-" } 
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                API id 
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><span style={{color : "#000" , fontWeight : '500'}} >{coin.id}</span> </span>
                            </Col>
                        </Row>
                        <Row>
                        <Col style={{padding : '10px',textAlign : 'right'}}>
                                Tags 
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                                {coin.categories.map((category)=>{
                                        if(category !== ""){
                                            return (<span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><span style={{color : "#000" , fontWeight : '500'}}>{category}</span></span>)
                                        }
                                })}
                            </Col>
                        </Row>
                    </Col>
                    
                    <Col style={{border: '1px solid grey',borderRadius : '50px',margin : '5px',backgroundColor : '#ECECEC'}} >
                        <Row>
                            <Col style={{padding : '10px'}}>
                                <span style={{backgroundColor: "grey",borderRadius: '5px 5px 5px 5px',padding : '3px',fontWeight : 'bold',color : 'white'}} >Market Cap Rank : #{coin.market_cap_rank} </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',fontSize : '25px'}}>
                                Current Price :<span style={{fontWeight : 'bold'}}><span style={{fontSize : '28px'}}> {coin.market_data.current_price[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}</span></span>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',fontSize : '15px'}}>
                                <Row>
                                    <Col>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item style={{backgroundColor : '#ECECEC'}}>
                                                Market Cap <br/> {coin.market_data.market_cap[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}
                                            </ListGroup.Item >
                                            { Object.keys(coin.market_data.fully_diluted_valuation).length !== 0 ? 
                                                <ListGroup.Item style={{backgroundColor : '#ECECEC'}}>
                                                Fully Diluted Valuation <br/> {coin.market_data.fully_diluted_valuation[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}
                                            </ListGroup.Item>
                                            :null}
                                            <ListGroup.Item style={{backgroundColor : '#ECECEC'}}>
                                            24 Hour Trading Vol <br/> {coin.market_data.total_volume[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col>
                                    <ListGroup variant="flush">
                                            <ListGroup.Item style={{backgroundColor : '#ECECEC'}}>
                                                Circulating Supply <br/> {coin.market_data.circulating_supply.toLocaleString()}
                                            </ListGroup.Item>
                                            { coin.market_data.total_supply !== null ? 
                                                <ListGroup.Item style={{backgroundColor : '#ECECEC'}}>
                                                    Total Supply <br/> {coin.market_data.total_supply.toLocaleString()}
                                                </ListGroup.Item> 
                                            :  <ListGroup.Item style={{backgroundColor : '#ECECEC'}}>
                                                Total Supply <br/> {'∞'}
                                                </ListGroup.Item>
                                            }
                                            { coin.market_data.max_supply !== null ? 
                                                <ListGroup.Item style={{backgroundColor : '#ECECEC'}}>
                                                    Max Supply <br/> {coin.market_data.max_supply.toLocaleString()}
                                                </ListGroup.Item>
                                            :null}
                                        </ListGroup>
                                    </Col>
                                </Row>                           
                            </Col>
                        </Row>
                    </Col>
                    <Col  style={{ border: '1px solid grey',borderRadius : '50px',margin : '5px',backgroundColor : '#ECECEC'}}>
                        <Row>
                            <Col style={{padding : '10px'}}>
                                <span style={{backgroundColor: "grey",borderRadius: '5px 5px 5px 5px',padding : '3px',fontWeight : 'bold',color : 'white'}}>Market Stats</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                All-Time High
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                                <Row>
                                    <Col>
                                        <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><span style={{color : "#000" , fontWeight : '500'}} >{coin.market_data.ath[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}{' '}({athPercChange(coin.market_data.ath_change_percentage[currency])})</span> </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px',fontSize : '11px'}} ><span style={{color : "#000" , fontWeight : '500'}} >{parseISODate(coin.market_data.ath_date[currency])}</span> </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                        <Col style={{padding : '10px',textAlign : 'right'}}>
                                All-Time Low
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                                <Row>
                                    <Col>
                                        <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><span style={{color : "#000" , fontWeight : '500'}} >{coin.market_data.atl[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}{' '}({athPercChange(coin.market_data.atl_change_percentage[currency])})</span> </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px',fontSize : '11px'}} ><span style={{color : "#000" , fontWeight : '500'}} >{parseISODate(coin.market_data.atl_date[currency])}</span> </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                24h Low / 24h High
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><span style={{color : "#000" , fontWeight : '500'}} > {coin.market_data.low_24h[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}{' / '}{coin.market_data.high_24h[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}</span> </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                24hr Price Change
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><span style={{color : "#000" , fontWeight : '500'}} >{coin.market_data.price_change_24h_in_currency[currency].toLocaleString()}{' '}{btcExRateArray[currency].unit}({athPercChange(coin.market_data.price_change_percentage_24h_in_currency[currency])})</span> </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                7d Price Percentage Change
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><span style={{color : "#000" , fontWeight : '500'}} >{' '}{btcExRateArray[currency].unit}({athPercChange(coin.market_data.price_change_percentage_7d_in_currency[currency])})</span> </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                Market Cap Dominance	
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left'}}>
                                <span style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><span style={{color : "#000" , fontWeight : '500'}} >{mCapDominance(globalInf.data.total_market_cap[currency],coin.market_data.market_cap[currency])}</span> </span>
                            </Col>
                        </Row>
                    </Col>
                    </Row>
                    <Row  style={{   }}>
                        <Col>
                            chart
                        </Col>
                    </Row>
                    </Fragment>
                }
                </Fragment>
            }
           
        </Container>
    )
}

export default CoinDetails