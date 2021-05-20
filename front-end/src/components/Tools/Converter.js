import React, { useState, useEffect, useRef } from 'react'
import  { coinList, priceOfCoins, coinListMarkets } from '@arisk1/cg-functions';
import { InputGroup, Button, Form, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';


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
        
    // effects
    useEffect(async () => {
        const fetchCoinlist = async() => {
            const res = await coinList();
            setCoinlist(res.data.map((coin => { return {id:coin.id, name:coin.name} })));
        }
        await fetchCoinlist();
        //eslint-disable-next-line
    },[])

    useEffect(async () => {
        const fetchTopCoins = async() => {
            const res = await coinListMarkets(localStorage.currency,'market_cap_desc',1, false);
            setTopCoins(res.data.slice(0,20));
        }
        if(coinlist && coinlist.length > 0 && topCoins.length===0){
            await fetchTopCoins();
        }
        //eslint-disable-next-line
    },[coinlist])

    // refs
    const coin1_ref = useRef('')
    const coin2_ref = useRef('')
    const resultRef = useRef('')

    // functions
    const onChange = (e) => {
        setConversion({...conversion, [e.target.name]: e.target.value })

        if(e.target.name === "coin1"){
            // coin from
            if(coin1_ref.current.value !== ''){
                // filter
                const res = coinlist.filter((coin) => {
                    const regex = new RegExp(`^${e.target.value}`, 'i');
                    const mtch = coin.name.match(regex);
                    return mtch
                })
                setFiltered({...filtered, from:res})
                setClicked({...clicked, from:true})
            }
            else{
                setFiltered({...filtered, from:[]})
                setClicked({...clicked, from:false})
            }
        }
        else{
            // coin to
            if(coin2_ref.current.value !== ''){
                // filter
                const res = coinlist.filter((coin) => {
                    const regex = new RegExp(`^${e.target.value}`, 'i');
                    const mtch = coin.name.match(regex);
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
    }

    const onClickCoin1 = (name) => {
        coin1_ref.current.value = name
        setConversion({...conversion, coin1:name })
    }

    const onClickCoin2 = (name) => {
        coin2_ref.current.value = name
        setConversion({...conversion, coin2:name })
    }

    const onClickButton = (e) => {
        const value = !(clicked[e.target.id])
        setClicked({...clicked, [e.target.id]:value})
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log("yeahh")

        // const res = await priceOfCoins([conversion.coin1, conversion.coin2], ['usd'])
    }

    return (
        <div className="converter-container">
            <h2>Cryptocurrency Converter Calculator</h2> <br/><br/>
            <Form onSubmit={onSubmit}>
            <div className="grid-2">
                <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Amount to convert"
                    onChange={onChange}
                    required
                />
                <Form.Control className="hidden"
                    placeholder="Amount to convert"
                    aria-label="amount_convert"
                    aria-describedby="basic-addon"
                />

                <InputGroup>
                    <Form.Control
                        type="text"
                        name="coin1"
                        placeholder="From"
                        onChange={onChange}
                        ref={coin1_ref}
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
                                return <Dropdown.Item key={coin.id} onClick={() => onClickCoin1(coin.name)}> 
                                            {coin.name} 
                                        </Dropdown.Item>
                            }
                        )
                        : filtered.from.map(
                            (coin) => {
                                return <Dropdown.Item key={coin.id} onClick={() => onClickCoin1(coin.name)}> 
                                            {coin.name} 
                                        </Dropdown.Item>
                            }
                        )}
                    </DropdownButton>
                </InputGroup>
                <InputGroup>
                    <Form.Control
                        type="text"
                        name="coin2"
                        placeholder="To"  
                        onChange={onChange}
                        ref={coin2_ref}
                        required
                    />

                    <DropdownButton
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
                                return <Dropdown.Item key={coin.id} onClick={() => onClickCoin2(coin.name)}> 
                                            {coin.name} 
                                        </Dropdown.Item>
                            }
                        )
                        : filtered.to.map(
                            (coin) => {
                                return <Dropdown.Item key={coin.id} onClick={() => onClickCoin2(coin.name)}> 
                                            {coin.name} 
                                        </Dropdown.Item>
                            }
                        )}
                    </DropdownButton>
                </InputGroup>
            </div><br />
            <Button variant="dark" type="submit">Convert!</Button>
            <p>
                Result: <span ref={resultRef}></span>
            </p>
            </Form>
        </div>
    )
}

export default Converter
