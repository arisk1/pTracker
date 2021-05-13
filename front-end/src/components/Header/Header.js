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
import React , { useEffect,Fragment, useContext } from 'react';
import { Link} from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import CurrencyContext from '../../context/currency/currencyContext';


const Header = () => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loadUser, user } = authContext;

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
    const ShowUserIcon = () => {
        return (

            <Dropdown >
                <Dropdown.Toggle as={CustomToggle} className="user-icon-outline border-0 p-1" variant="" id="dropdown-basic" />
                <Dropdown.Menu>
                    <Dropdown.ItemText href="#/action-0">Hello {user && user.name} </Dropdown.ItemText><hr />
                    <Dropdown.Item as={Link} to={{pathname:'/profile'}}>Profile</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    <Dropdown.Divider/>
                    <Logout />

                </Dropdown.Menu>
            </Dropdown>

        );
    }
    const ShowSignUpAndLogIn = () => {
        return (
            <Fragment>
                <LogIn />
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
                    </Nav>
                    <Nav>
                        {isAuthenticated ? <ShowUserIcon/> : <ShowSignUpAndLogIn/>}
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
