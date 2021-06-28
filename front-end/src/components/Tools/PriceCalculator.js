import React, { useState, useEffect, useRef } from 'react'
import  { coinListMarkets } from '@arisk1/cg-functions';
import { InputGroup, Form, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import Spinner from '../Spinner/Spinner'

const PriceCalculator = () => {

    // states
    const [coinlist,
        setCoinlist] = useState([]);
    const [topCoins,
        setTopCoins] = useState([]);
    const [conversion,
        setConversion] = useState({
            coin1: "",
            csupply1: 0,
            mcap1:0,
            coin2: "",
            csupply2: 0,
            mcap2: 0
        })
    const [showCoins,
        setShowCoins] = useState({
            coin1: "",
            coin2: ""
        })

    const [filtered, setFiltered] = useState({
        from: [],
        to: []
    })
    const [clicked, setClicked] = useState({
        from: false,
        to: false
    })
    const [result,
        setResult] = useState('')

    // effects
    useEffect(async () => {
        const fetchCoinlist = async() => {
            // get 1500 top coins by requesting coin/markets
            let page_index = 1;
            const last_page = 10
            let temp_coins = []
            while(page_index <= last_page){
                const res = await coinListMarkets('usd',[],'market_cap_desc',page_index, false, 250);
                console.log(page_index)
                temp_coins = [...temp_coins].concat(res.data.map((coin => { 
                    const { id, name, symbol, image, circulating_supply, market_cap } = coin
                    return { 
                        id, 
                        name,
                        symbol,
                        image,
                        csupply: circulating_supply,
                        mcap:market_cap
                    } 
                })))
                if(page_index === 1){
                    // set initial input values (the top 2 cryptos)
                    setConversion({
                        coin1: temp_coins[1].name,
                        csupply1: temp_coins[1].csupply,
                        mcap1: temp_coins[1].mcap,

                        coin2: temp_coins[0].name,
                        csupply2: temp_coins[0].csupply,
                        mcap2: temp_coins[0].mcap
                    })
                    setShowCoins({
                        coin1: temp_coins[1].name,
                        coin2: temp_coins[0].name,
                    })
                    coin1_photo_ref.current.src = temp_coins[1].image
                    coin2_photo_ref.current.src = temp_coins[0].image
                }

                page_index += 1;
            }
            setCoinlist(temp_coins);
            setTopCoins(temp_coins.slice(0,20));
        }
        await fetchCoinlist();
        //eslint-disable-next-line
    },[])

    useEffect(() => {
        if(conversion.csupply1 > 0){
            calculateResult()
        }
    }, [conversion.coin1, conversion.coin2])

    // refs
    const coin1_photo_ref = useRef('')
    const coin2_photo_ref = useRef('')

    // functions
    const onChange = (e) => {
        setShowCoins({...conversion, [e.target.name]: e.target.value })

        // filter results
        if(e.target.name === "coin1"){
            // coin from
            if(e.target.value !== ''){
                const res = coinlist.filter((coin) => {
                    try {
                        const regex = new RegExp(`^${e.target.value}`, 'i');
                        const mtch = coin.name.match(regex) || coin.symbol.match(regex);
                        return mtch
                    } catch (error) {
                        console.log(error)
                        return null
                    }
                })
                if(res !== null){
                    setFiltered({...filtered, from:res})
                    setClicked({...clicked, from:true})
                }
            }
            else{
                setFiltered({...filtered, from:[]})
                setClicked({...clicked, from:false})
            }
        }
        else if(e.target.name === "coin2"){
            // coin to
            if(e.target.value !== ''){
                const res = coinlist.filter((coin) => {
                    const regex = new RegExp(`^${e.target.value}`, 'i');
                    const mtch = coin.name.match(regex) || coin.symbol.match(regex);
                    return mtch
                })
                setFiltered({...filtered, to:res})
                setClicked({...clicked, to:true})
            }
            else{
                setFiltered({...filtered, to:[]})
                setClicked({...clicked, to:false})
            }
        }
        else{
            // amount
            setConversion({...conversion, [e.target.name]: e.target.value })
        }
    }

    const onClickCoin1 = (coin) => {
        const { name, csupply, mcap, image } = coin
        setShowCoins({...showCoins, coin1:name})
        setConversion({...conversion, coin1:name, csupply1:csupply, mcap1:mcap })
        coin1_photo_ref.current.src = image
    }

    const onClickCoin2 = (coin) => {
        const { name, csupply, mcap,image } = coin
        setShowCoins({...showCoins, coin2:name})
        setConversion({...conversion, coin2:name, csupply2:csupply, mcap2:mcap })
        coin2_photo_ref.current.src = image
    }

    const onClickButton = (e) => {
        const value = !(clicked[e.target.id])
        setClicked({...clicked, [e.target.id]:value})
    }

    const resetShow = (e) => {
        // reset input value to previous correct, so that only coins from the list are selected
        if(e.target.name === "coin1"){
            setShowCoins({...showCoins, coin1:conversion.coin1})
        }
        else if(e.target.name === "coin2"){
            setShowCoins({...showCoins, coin2:conversion.coin2})
        }
    }

    const calculateResult = async () => {
        const { csupply1, mcap2 } = conversion
        const value = mcap2 / csupply1
        setResult(value.toFixed(3))
    }

    return (
        <div className="price-calculator-container">
            <h2>Cryptocurrency Price Calculator</h2>
            <p>Calculate a coin's price if it had the other coin's market capitalization</p>
            {coinlist.length===0 ? <Spinner /> : null}<br/><br/>

            <div className="price-calculator-row">
                <InputGroup onBlur={resetShow}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-sm">
                            <img ref={coin1_photo_ref} className="input-img" alt="photo" src="smth"/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        autoComplete="off"
                        type="text"
                        id="coin1"
                        name="coin1"
                        placeholder="From"
                        value={showCoins.coin1}
                        onChange={onChange}
                        required
                    />

                    <DropdownButton
                        menuAlign="right"
                        as={InputGroup.Append}
                        variant="outline-secondary"
                        id="from"
                        title="Coins"
                        onClick={onClickButton}
                        show={clicked.from}
                    >
                        <Dropdown.Header>  {filtered.from.length===0 ? "Top Coins" : "Results"}  </Dropdown.Header>
                        <Dropdown.Divider />
                        {filtered.from.length===0 
                        ? topCoins.map(
                            (coin) => {
                                return <Dropdown.Item key={coin.id} onClick={() => onClickCoin1(coin)}> 
                                            <img alt={coin.id} className="img" src={coin.image}/>{coin.name}
                                        </Dropdown.Item>
                            }
                        )
                        : filtered.from.map(
                            (coin) => {
                                return <Dropdown.Item key={coin.id} onClick={() => onClickCoin1(coin)}> 
                                            <img alt={coin.id} className="img" src={coin.image}/>{coin.name} 
                                        </Dropdown.Item>
                            }
                        )}
                    </DropdownButton>
                </InputGroup>

                <div className="coin-info">
                    <p className="coin-info-header"> Coin "From" Info </p>
                    <p>Circulating Supply : {conversion.csupply1.toLocaleString()}</p>
                </div>
            </div>

            <br /><div className="price-calculator-row">
                <InputGroup onBlur={resetShow}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroup-sizing-sm">
                            <img ref={coin2_photo_ref} className="input-img" alt="photo" src="smth"/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        autoComplete="off"
                        type="text"
                        id="coin2"
                        name="coin2"
                        placeholder="To"  
                        value={showCoins.coin2}
                        onChange={onChange}
                        required
                    />

                    <DropdownButton
                        menuAlign="right"
                        as={InputGroup.Append}
                        variant="outline-secondary"
                        id="to"
                        title="Coins"
                        onClick={onClickButton}
                        show={clicked.to}
                    >
                        <Dropdown.Header>  {filtered.to.length===0 ? "Top Coins" : "Results"}  </Dropdown.Header>
                        <Dropdown.Divider />
                        {filtered.to.length===0 
                        ? topCoins.map(
                            (coin) => {
                                return <Dropdown.Item key={coin.id} onClick={() => onClickCoin2(coin)}> 
                                            <img alt={coin.id} className="img" src={coin.image}/>{coin.name} 
                                        </Dropdown.Item>
                            }
                        )
                        : filtered.to.map(
                            (coin) => {
                                return <Dropdown.Item key={coin.id} onClick={() => onClickCoin2(coin)}> 
                                            <img alt={coin.id} className="img" src={coin.image}/>{coin.name} 
                                        </Dropdown.Item>
                            }
                        )}
                    </DropdownButton>
                </InputGroup>
                <div className="coin-info">
                    <p className="coin-info-header"> Coin "To" Info </p>
                    <p>Market Cap : {conversion.mcap2.toLocaleString()}</p>
                </div>
            </div><br /><br />

            {(conversion.coin1 && conversion.coin2) ? 
                <p>
                    {conversion.coin1}'s projected price = 
                    <span className="converter-result"> {result}{" $"}</span>
                </p> :
                null
            }
        </div>
    )
}

export default PriceCalculator
