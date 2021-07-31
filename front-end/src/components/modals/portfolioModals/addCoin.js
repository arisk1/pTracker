import React, { Fragment,useState, useContext, useEffect, useRef} from 'react';
import { Modal, Button, Form ,InputGroup ,Dropdown,DropdownButton} from 'react-bootstrap';
import  { coinListMarkets } from '@arisk1/cg-functions';
import Spinner from '../../Spinner/Spinner';



const AddCoinModal = (props) => {

    const [show, setShow] = useState(false);
    const [newCoin,setNewCoin] = useState("");
    const [error,setError] = useState(false);
    const [coinlist,setCoinlist] = useState([]);
    const [topCoins,setTopCoins] = useState([]);
    const [showCoins,setShowCoins] = useState({coin1: ""})
    const [conversion,setConversion] = useState({coin1: "",price1: 0})

    const [filtered, setFiltered] = useState({
        from: [],
        to: []
    })
    const [clicked, setClicked] = useState({
        from: false,
        to: false
    })
  
    const handleClose = () => setShow(false);

    const ShowError = () => {
        return (
            <Form.Text
                className=""
                style={{
                color: "red",
                paddingBottom: "1vh",
                fontSize: "14px"
            }}>
            This coin is already a part of your portfolio!
            </Form.Text>
        );
    }

    const closeAndAdd = (e) => {
        e.preventDefault();
        const i = (props.coins).map((coin)=>{
            if(coin.id === newCoin){
                setError(true)
                return "dont-add";
            }else{
                return null;
            }
        })
        if(!i.includes('dont-add')){
            props.addCoin(newCoin,props.pid)
            setShow(false)
        }
    }
    
    const handleShow = async () => {
        setShow(true);
        setError(false)
        await fetchCoinlist();
    };

    const onChange = (e) => {
        setShowCoins({...conversion, [e.target.name]: e.target.value })
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

    const onClickCoin1 = (coin) => {
        const { name, price , id } = coin
        setShowCoins({...showCoins, coin1:name})
        setNewCoin(id)
    }

    const onClickButton = (e) => {
        const value = !(clicked[e.target.id])
        setClicked({...clicked, [e.target.id]:value})
    }

    const resetShow = (e) => {
        // reset input value to previous correct, so that only coins from the list are selected
        if(e.target.name === "coin1"){
            setShowCoins({...showCoins, coin1:showCoins.coin1})
        }
    }

    const fetchCoinlist = async() => {
    // get 1500 top coins by requesting coin/markets
    let page_index = 1;
    const last_page = 10
    let temp_coins = []
        while(page_index <= last_page){
            const res = await coinListMarkets('usd',[],'market_cap_desc',page_index, false, 250);
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
            page_index += 1;
        }
        setCoinlist(temp_coins);
        setTopCoins(temp_coins.slice(0,20));
    }
       


    return(
        <Fragment>
            <Button variant="primary" onClick={handleShow}>Add Coin</Button>{' '}
            {console.log(coinlist)}
            {console.log(topCoins)}
            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add new coin</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{fontSize : '22px'}}>
            {coinlist.length===0 ? <Fragment><Spinner /><h6 style={{textAlign : 'center'}}>Loading available coins. . . </h6></Fragment> : null}
            <Form onSubmit={closeAndAdd} >
            
            <div className="grid-3-conv-modal">
            <p style={{fontSize : '12px',textAlign : 'center'}}>You need to click the coin you want to add from the list!</p>
            <Form.Group as={InputGroup} onBlur={resetShow} controlId="formdropdownlist">
                    <Form.Control
                        autoComplete="off"
                        type="text"
                        name="coin1"
                        placeholder="Search the coin you wish to add..."
                        onChange={onChange}
                        value={showCoins.coin1}
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
                    </Form.Group>
                    {error ? <ShowError /> : null}
                    <Button variant='dark' type="submit" size="lg" block>
                        Add   
                    </Button>
                </div>
                
                </Form>
                {/* <Form onSubmit={closeAndAdd}>
                    <Form.Group controlId="formBasicPortfolioName">
                        <Form.Control
                            onChange={(e)=>setNewCoin(e.target.value)}
                            type="text"
                            name="name"
                            placeholder="Enter coin's name..."
                            required/>
                            {error ? <ShowError /> : null}
                    </Form.Group>
                    <Button variant='dark' type="submit" size="lg" block>
                    Add   
                </Button>
                </Form> */}
               
            </Modal.Body>
        </Modal>
        </Fragment>

    )
}

export default AddCoinModal;