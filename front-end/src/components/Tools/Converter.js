import React, { useState, useEffect, useRef } from 'react'
import  { coinListMarkets } from '@arisk1/cg-functions';
import { InputGroup, Form, DropdownButton, Dropdown } from 'react-bootstrap';
import Spinner from '../Spinner/Spinner'

const Converter = () => {
    // states
    const [coinlist,
        setCoinlist] = useState([]);
    const [topCoins,
        setTopCoins] = useState([]);
    const [conversion,
        setConversion] = useState({
            amount: 0,
            coin1: "",
            price1: 0,
            coin2: "",
            price2: 0
        })
    const [showCoins,
        setShowCoins] = useState({
            amount:0,
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
            // get 1000 top coins by requesting coin/markets
            let page_index = 1;
            const last_page = 10
            let temp_coins = []
            while(page_index <= last_page){
                const res = await coinListMarkets('usd','market_cap_desc',page_index, false);
                temp_coins = [...temp_coins].concat(res.data.map((coin => { 
                    const { id, name, symbol, image, current_price, market_cap } = coin
                    return { 
                        id, 
                        name,
                        symbol,
                        image,
                        price:current_price,
                        mcap:market_cap
                    } 
                })))
                if(page_index === 1){
                    // set initial input values
                    setConversion({
                        // ...conversion,
                        amount:1,
                        coin1: temp_coins[0].name,
                        price1: temp_coins[0].price,
                        coin2: temp_coins[1].name,
                        price2: temp_coins[1].price,
                    })
                    setShowCoins({
                        amount: 1,
                        coin1: temp_coins[0].name,
                        coin2: temp_coins[1].name,
                    })
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
        if(conversion.price2 > 0){
            calculateResult()
        }
    }, [conversion.amount, conversion.coin1, conversion.coin2])

    // functions
    const onChange = (e) => {
        setShowCoins({...conversion, [e.target.name]: e.target.value })

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
            // fix amount
            setConversion({...conversion, [e.target.name]: e.target.value })
        }
    }

    const onClickCoin1 = (coin) => {
        const { name, price } = coin
        setShowCoins({...showCoins, coin1:name})
        setConversion({...conversion, coin1:name, price1:price })
    }

    const onClickCoin2 = (coin) => {
        const { name, price } = coin
        setShowCoins({...showCoins, coin2:name})
        setConversion({...conversion, coin2:name, price2:price })
    }

    const onClickButton = (e) => {
        const value = !(clicked[e.target.id])
        setClicked({...clicked, [e.target.id]:value})
    }

    const resetShow = (e) => {
        if(e.target.name === "coin1"){
            setShowCoins({...showCoins, coin1:conversion.coin1})
        }
        else if(e.target.name === "coin2"){
            setShowCoins({...showCoins, coin2:conversion.coin2})
        }
    }

    const calculateResult = async (e) => {
        const { amount, price1, price2 } = conversion

        const result = (amount * price1) / price2
        console.log(result)
        setResult(result.toString())
    }

    return (
        <div className="converter-container">
            <h2>Cryptocurrency Converter Calculator</h2>
            {coinlist.length===0 ? <Spinner /> : null}<br/><br/>
            <Form>
            <div className="grid-2">
                <Form.Control
                    autoComplete="off"
                    type="number"
                    name="amount"
                    value={showCoins.amount}
                    placeholder="Amount to convert"
                    onChange={onChange}
                    required
                />
                <Form.Control className="hidden"
                    placeholder="Amount to convert"
                    aria-label="amount_convert"
                    aria-describedby="basic-addon"
                />

                <InputGroup onBlur={resetShow}>
                    <Form.Control
                        autoComplete="off"
                        type="text"
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
                <InputGroup onBlur={resetShow}>
                    <Form.Control
                        autoComplete="off"
                        type="text"
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
            </div><br />
            </Form><br />
            {conversion.amount ? 
                <p>
                    {conversion.amount} {conversion.coin1} = 
                    <span className="converter-result"> {result}{" "}</span>{conversion.coin2}
                </p> :
                null
            }
        </div>
    )
}

export default Converter
