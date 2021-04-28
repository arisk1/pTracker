import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Container,
    Dropdown
} from 'react-bootstrap';
import logo from './orbz_moon.png';
import LogIn from '../LogIn/logIn.js';
import SignUp from '../SignUp/signUp.js';
import Logout from '../Logout/logOut.js';
import userIcon from './userIcon.png';
import React , {useEffect, useState} from 'react';
import axios from 'axios';
import {Link,useHistory} from 'react-router-dom';


function Header() {
    let history = useHistory();
    const [showIcon,setShowIcon] = useState(false);
    const [user,setUser] = useState({});
    const [VsCurrencies,setVsCurrencies] = useState([]);
    const [title,setTitle] = useState("usd");
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
    const ShowUserIcon = () => {
        console.log(user)
        return (

            <Dropdown >
                <Dropdown.Toggle as={CustomToggle} className="user-icon-outline border-0 p-1" variant="" id="dropdown-basic" />
                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    <Dropdown.Divider/>
                    <Logout token={user.token} hideUserIcon={() => setShowIcon(false)}/>
                </Dropdown.Menu>
            </Dropdown>

        );
    }
    const ShowSignUpAndLogIn = () => {
        return (<> <LogIn setUser={setUser} showUserIcon={() => setShowIcon(true)}/> < SignUp setUser={setUser} showUserIcon = {
            () => setShowIcon(true)
        } /> </>)
    }
   
    useEffect(()=>{
        history.push({
            pathname: '/',
            state: { title }
        });
    },[history,title])

    useEffect(()=>{
        const fetchVsCurrencies = async() => {
            const res = await axios.get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies');
            setVsCurrencies(res.data);
        }
        
        fetchVsCurrencies();
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
                    pTracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to={{pathname:'/'}}>Home</Nav.Link>
                        <NavDropdown title={title.toUpperCase()} id="basic-nav-dropdown">
                        <Dropdown.Header>  Supported Currencies  </Dropdown.Header>
                        <Dropdown.Divider />
                            {VsCurrencies.map((cur,idx)=>(
                                <NavDropdown.Item onClick={()=> setTitle(cur)}  key={idx}>{cur.toUpperCase()}</NavDropdown.Item>
                            ))}
                            
                        </NavDropdown>
                    </Nav>
                    <Nav>
                    {showIcon
                            ? <ShowUserIcon/>
                            : null}
                        {!showIcon
                            ? <ShowSignUpAndLogIn/>
                            : null}
                    </Nav>
                    
                    <Form className="form-inline">
                    
                        <FormControl  type="text" placeholder="Search" className="mr-sm-2 my-form-inline"/>
                    
                    </Form>
                    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;
