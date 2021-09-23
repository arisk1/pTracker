import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Container,
    Dropdown,
    DropdownButton
} from 'react-bootstrap';
import logo from './orbz_moon.png';
import LogIn from '../LogIn/logIn.js';
import SignUp from '../SignUp/signUp.js';
import Logout from '../Logout/logOut.js';
import userIcon from './userIcon.png';
import React , { useState,useEffect,Fragment, useContext } from 'react';
import { Link} from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import CurrencyContext from '../../context/currency/currencyContext';
import  { coinList, coinListMarkets } from '@arisk1/cg-functions';
import Spinner from '../Spinner/Spinner';



const Header = () => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loadUser, user } = authContext;
    const [coinlist,setCoinlist] = useState([]);
    const [newCoin,setNewCoin] = useState("");
    const [conversion,setConversion] = useState({coin1: "",price1: 0})
    const [topCoins,setTopCoins] = useState([]);
    const [showCoins,setShowCoins] = useState({coin1: ""})
    const [filtered, setFiltered] = useState({
        from: [],
        to: []
    })
    const [clicked, setClicked] = useState({
        from: false,
        to: false
    })


    const currencyContext = useContext(CurrencyContext);
     const {currency , vsCurrencies , setCurrency , getCurrencies} = currencyContext;    
        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <a
              href="/"
              ref={ref}
              onClick={e => {
                e.preventDefault();
                onClick(e);
              }}
            >
              <img
                        alt="pTracker-logo"
                        src={userIcon}
                        width="30"
                        height="30"
                        className="d-inline-block align-middle user-img "/>
              {children}
            </a>
          ));
          const loadCoins = async () => {
              if(coinList.length === 0 ){
                await fetchCoinlist();
              }
          }

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
            loadCoins();
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
               
          
    const ShowUserIcon = () => {
        return (

            <Dropdown >
                <Dropdown.Toggle as={CustomToggle} className="user-icon-outline border-0 p-1" variant="" id="dropdown-basic" />
                <Dropdown.Menu>
                    <Dropdown.ItemText href="#/action-0">Hello {user && user.name} </Dropdown.ItemText><hr />
                    <Dropdown.Item as={Link} to={{pathname:'/profile'}}>Profile</Dropdown.Item>
                    <Dropdown.Divider/>
                    <Logout />

                </Dropdown.Menu>
            </Dropdown>

        );
    }
    const ShowSignUpAndLogIn = () => {
        return (
            <Fragment>
                <LogIn variant={"outline-light"} class={"mr-sm-2 button-outline"} />
                < SignUp />
            </Fragment>
        )
    }
   
    useEffect(()=>{
        getCurrencies();
        // load user where component loads
        loadUser();
        //eslint-disable-next-line
    },[])

    return (

        <Navbar bg="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        alt="pTracker-logo"
                        src={logo}
                        width="40"
                        height="40"
                        className="d-inline-block align-middle"/>
                        pTracker
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title={currency.toUpperCase()} id="basic-nav-dropdown">
                            <Dropdown.Header>  Supported Currencies  </Dropdown.Header>
                            <Dropdown.Divider />
                            {vsCurrencies.map((cur,idx)=>(
                                <NavDropdown.Item onClick={()=> setCurrency(cur)}  key={idx}>
                                    {cur.toUpperCase()}
                                </NavDropdown.Item>
                            ))}
                        </NavDropdown>

                        <Nav.Link as={Link} to={{pathname:'/'}}>Home</Nav.Link>
                        <Nav.Link as={Link} to={{pathname:'/portfolio'}}>Portfolio</Nav.Link>
                        <Nav.Link as={Link} to={{pathname:'/heatmap'}}>Heatmap</Nav.Link>
                        <NavDropdown title="Tools" id="basic-nav-dropdown">
                            <Dropdown.Header>  Cryptocurrency Tools  </Dropdown.Header>
                            <Dropdown.Divider />
                            <NavDropdown.Item as={Link} to={{pathname:'/converter'}}>
                                Converter
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={{pathname:'/price-calculator'}}>
                                Price Calculator
                            </NavDropdown.Item>
                            
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        {isAuthenticated ? <ShowUserIcon/> : <ShowSignUpAndLogIn/>}
                    </Nav>
                    
                    <Form.Group className="form-inline m-0"  onBlur={resetShow} controlId="formdropdownlist" >
                        <Form.Control 
                        onClick={()=>loadCoins()}
                        autoComplete="off"
                        type="text"
                        name="coin1"
                        placeholder="Search"
                        onChange={onChange}
                        className="mr-sm-2 my-form-inline"
                        value={showCoins.coin1}
                        required
                    />       
                    <Dropdown>
                    <DropdownButton
                        menuAlign="right"
                        
                        variant="secondary"
                        id="from"
                        title="Top Coins"
                        onClick={onClickButton}
                        show={clicked.from}
                    >

                        <Dropdown.Header>  {filtered.from.length===0 ? "Top Coins - Click the coin to search it" : "Results - Click the coin to search it"}  </Dropdown.Header>
                        <Dropdown.Divider />
                        
        
                        {coinlist.length===0 ? <Fragment><Spinner /><h6 style={{textAlign : 'center'}}>Loading available coins. . . </h6></Fragment> : null}
                        {filtered.from.length===0 
                        ? topCoins.map(
                            (coin) => {
                                return <Dropdown.Item key={coin.id} as={Link} to={{pathname:`/coins/${coin.id}`}} onClick={() => onClickCoin1(coin)}> 
                                            <img alt={coin.id} className="img" src={coin.image}/>{coin.name}
                                        </Dropdown.Item>
                            }
                        )
                        : filtered.from.map(
                            (coin) => {
                                return <Dropdown.Item key={coin.id} as={Link} to={{pathname:`/coins/${coin.id}`}} onClick={() => onClickCoin1(coin)}> 
                                            <img alt={coin.id} className="img" src={coin.image}/>{coin.name}
                                        </Dropdown.Item>
                            }
                        )}
                    </DropdownButton>
                    </Dropdown>
                    </Form.Group>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;
