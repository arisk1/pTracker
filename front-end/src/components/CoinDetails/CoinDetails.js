import React, {useEffect, useState, useContext, Fragment} from 'react';
import { useParams} from "react-router"; 
import {Container,Row,Col,ListGroup,Dropdown,NavDropdown,Button,Modal} from 'react-bootstrap';
import CurrencyContext from '../../context/currency/currencyContext';
import  {coinInfo,coinList,exchangeRates,globalInfo,chartInfo } from '@arisk1/cg-functions';
import Spinner from '../Spinner/Spinner';
import NotFound from '../NotFound/NotFound';
import { Link} from 'react-router-dom';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,ResponsiveContainer } from 'recharts';



const CoinDetails = () => {

    let { coinid } = useParams();
    // context
    const currencyContext = useContext(CurrencyContext);
    const {currency} = currencyContext; 
    const [coin,setCoin] = useState({});
    const [btcExRateArray , setBtcExRateArray] = useState({});
    const [globalInf,setGlobalInfo] = useState({});
    const [notfound , setNotFound] = useState(false);
    const [chartData , setChartData] = useState([]);
    const [timeline,setTimeline] = useState(1);
    const [clicked,setClicked] = useState(['info','outline-info','outline-info','outline-info']);
    const [chartLoading,setChartLoading]=useState(false);
    const [exchangesBoolean,setExchangeBoolean]=useState(false);
    const [bool , setBool] = useState(false); 
    const [show, setShow] = useState({
        network : '',
        address : '',
        modalshow : false
    });


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

    const shortenString = (str) => {
        if(str.length > 6){
            return str.substr(0, 3) + '...' + str.substr(str.length-3,str.length);
        }
        return str;
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

    const ModalCopyToClipboard = () => {
        return(
            <Modal show={show.modalshow} onHide={()=>setShow({network : '' , address : '' ,modalshow : false})}>
        <Modal.Header closeButton>
          <Modal.Title>Contract Address </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <span>Token id : {coin.id}<br/></span>
            <span>Network : {show.network}<br/></span>
            <span>Contract Address : {show.address}<br/></span>
            <span style={{color : 'green'}}>Contract Address Successfully Copied to Clipboard!</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={()=>setShow({network : '' , address : '' ,modalshow : false})}>
            OK
            </Button>
            </Modal.Footer>
            </Modal>
        )
    }

    useEffect(() => {  
        const fetchData = async() => {
            try{
                setBool(true)
                const res2 = await coinInfo(coinid);
                const res = await exchangeRates();
                const res3 = await globalInfo();
                setCoin(res2.data);
                setGlobalInfo(res3.data);
                setBtcExRateArray(res.data.rates);
                setBool(false)
            }catch(e){
                if(e.response.status === 404){
                    setNotFound(true)
                }
            }
        }
        fetchData();
    },[coinid])

    useEffect(()=>{
        const drawChart = async() => {
            const res4 = await chartInfo(coinid,currency,timeline);
            setChartData(((res4.data).prices).map((priceAndDate,idx)=>{
                return { "name" : new Date(priceAndDate[0]) , "value" : priceAndDate[1]}
            }))
            setChartLoading(false);
        }
        drawChart();
    },[timeline,currency,coinid])



    return(
        <Container>
            {notfound ? <NotFound /> :
            <Fragment>
            {( Object.keys(btcExRateArray).length === 0 || Object.keys(globalInf).length === 0  || Object.keys(coin).length ===0 ) || bool ? <Spinner /> 
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
                        {coin.platforms[""] !== "" ?
                        <Row>
                        <Col style={{padding : '10px',textAlign : 'right'}}>
                            Contract 
                        </Col>
                        <Col style={{padding : '10px',textAlign : 'left'}}>
                        
                            <NavDropdown bg="dark" title={"Watch Addresses"} id="contract-dropdown">
                            <Dropdown.Header> List Of Contract Addresses - click the address to copy it</Dropdown.Header>
                            <Dropdown.Divider />
                            {Object.keys(coin.platforms).map((platform,idx) => {
                                return(<NavDropdown.Item key={idx} onClick={() => {navigator.clipboard.writeText(coin.platforms[platform]);setShow({ network : platform ,address : coin.platforms[platform],modalshow : true});}}
                                >
                                    {platform + " -> " + coin.platforms[platform]  }
                                </NavDropdown.Item>)
                                
                            })}
                            </NavDropdown>
                        </Col>
                        {show.modalshow ? <ModalCopyToClipboard /> : null }
                    </Row>
                        
                        : null}
                        
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                Website 
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left', display : 'flex',flexWrap : 'wrap'}}>
                                {coin.links.homepage.map((homepage,idx)=>{
                                    if(homepage !== ""){
                                        return (<span key={idx} style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname:homepage}}  target="_blank">{normalizeUrl(homepage)}</Link></span>)
                                    }
                                })}                            
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{padding : '10px',textAlign : 'right'}}>
                                Explorers 
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left' , display : 'flex',flexWrap : 'wrap'}}>
                                {coin.links.blockchain_site.map((explorer,idx)=>{
                                    if(explorer !== ""){
                                        return (<span key={idx} style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname:explorer}}  target="_blank">{normalizeUrl(explorer)}</Link></span>)
                                    }
                                })}
                            </Col>
                        </Row>
                        <Row>
                        <Col style={{padding : '10px',textAlign : 'right'}}>
                                Community 
                            </Col>
                            <Col style={{padding : '10px',textAlign : 'left',display : 'flex',flexWrap : 'wrap'}}>
                            {coin.links.official_forum_url.map((forum,idx)=>{
                                    if(forum !== ""){
                                        return (<span key={idx} style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><Link style={{color : "#000" , fontWeight : '500'}} to={{pathname:forum}} target="_blank">{normalizeUrl(forum)}</Link></span>)
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
                            <Col style={{padding : '10px',textAlign : 'left', display : 'flex',flexWrap : 'wrap'}}>
                                {coin.categories.map((category,idx)=>{
                                        if(category !== ""){
                                            return (<span key={idx} style={{backgroundColor: "lightblue",borderRadius: '5px 5px 5px 5px',padding : '3px',margin : '2px'}} ><span style={{color : "#000" , fontWeight : '500'}}>{category}</span></span>)
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
                                            {"total_value_locked" in coin.market_data && coin.market_data.total_value_locked !== null ? 
                                                <ListGroup.Item style={{backgroundColor : '#ECECEC'}}>
                                                    Total Value Locked <br/> {coin.market_data.total_value_locked["usd"].toLocaleString()}{' '}{btcExRateArray[currency].unit}
                                                </ListGroup.Item>
                                            :null}
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
                                            { "mcap_to_tvl_ratio" in coin.market_data && coin.market_data.mcap_to_tvl_ratio !== null ? 
                                                <ListGroup.Item style={{backgroundColor : '#ECECEC'}}>
                                                    MCap / TVL Ratio <br/> {coin.market_data.mcap_to_tvl_ratio.toLocaleString()}
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
                    <Row style={{padding : '20px'}} >
                        <Col>
                            <Button variant="info" onClick={()=>setExchangeBoolean(!exchangesBoolean)}>
                                Click to learn where to buy
                            </Button>
                            
                               
                            
                        </Col>
                    </Row>
                    {exchangesBoolean ? 
                    <Fragment>
                        <ListGroup variant="flush">
                        <ListGroup.Item
                            style={{
                            backgroundColor: '#C0C0C0'

                        }}>
                        <Row style={{fontWeight : '500'}}>
                            <Col>Exchange</Col>
                            <Col> Pair</Col>
                            <Col> Price</Col>
                            <Col>Trust Score</Col>
                        </Row>
                        </ListGroup.Item>
                        {coin.tickers.map((markets,idx)=>{
                            return (
                                <ListGroup.Item key={idx}>
                                <Row style={{fontWeight : '500'}}>
                                    <Col> {markets.market.name}</Col>
                                    <Col  > <Link title="This Link will take you to the exchange" to={{pathname : markets.trade_url}} target="_blank" style={{textDecoration : 'underline'}}>{shortenString(markets.base)}/{shortenString(markets.target)}</Link></Col>
                                    <Col> {calculateCurrency(markets.converted_last['usd'])}{' '}{btcExRateArray[currency].unit}</Col>
                                    <Col> <span style={{height : '15px',width : '15px' , borderRadius : '50%',display:'inline-block',backgroundColor : markets.trust_score}}></span></Col>
                                </Row>
                                </ListGroup.Item>
                            )
                        })}
                        <Row>
                            <Col style={{padding : '20px'}}>
                                <Button  variant='outline-danger' onClick={()=>setExchangeBoolean(false)}>Close Exchanges' List</Button>
                            </Col>
                        </Row>
                    </ListGroup>
                    </Fragment>
                    : null}
                    <Row style={{padding : '20px'}} >
                        {chartData.length > 0 ? 
                        <Col>
                            <Row>
                                <Col>
                                    <Row>
                                        <Col style={{fontSize : '30px' , textDecoration : 'underline'}}>
                                        Currency : {currency}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button variant={clicked[0]} onClick={()=>{setChartLoading(true);setTimeline(1);setClicked(['info','outline-info','outline-info','outline-info'])}}>24hr</Button>{' '}
                                            <Button variant={clicked[1]} onClick={()=>{setChartLoading(true);setTimeline(7);setClicked(['outline-info','info','outline-info','outline-info'])}}>7d</Button>{' '}
                                            <Button variant={clicked[2]} onClick={()=>{setChartLoading(true);setTimeline(30);setClicked(['outline-info','outline-info','info','outline-info'])}}>30d</Button>{' '}
                                            <Button variant={clicked[3]} onClick={()=>{setChartLoading(true);setTimeline(365);setClicked(['outline-info','outline-info','outline-info','info'])}}>365d</Button>{' '}
                                        </Col>
                                    </Row> 
                                    {chartLoading ? 
                                    <Row>
                                        <Col>
                                            <h3>Chart Loading. . .</h3>
                                        </Col>
                                    </Row>
                                    :null
                                    }
                                    
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{width:"100%", height:300}}>
                                    <ResponsiveContainer width="100%">
                                        <LineChart width={600} height={300} data={chartData}  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} dot={false} />
                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={['auto', 'auto']}/>
                                        <Tooltip />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Col>
                            </Row>
                        </Col>
                        : <Spinner />
                        }
                        
                    </Row>
                    </Fragment>
                }
                </Fragment>
            }
           
        </Container>
    )
}

export default CoinDetails