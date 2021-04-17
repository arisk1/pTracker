import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Container,
    Dropdown,
} from 'react-bootstrap';
import logo from './orbz_moon.png';
import LogIn from '../LogIn/logIn.js';
import SignUp from '../SignUp/signUp.js';
import Logout from '../Logout/logOut.js';
import userIcon from './userIcon.png';
import React , {useState} from 'react';

function Header() {

    const [showIcon,setShowIcon] = useState(false);
    const [user,setUser] = useState({});
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
        return (<> <LogIn setUser={setUser} showUserIcon={() => setShowIcon(true)}/> < SignUp showUserIcon = {
            () => setShowIcon(true)
        } /> </>)
    }

    return (

        <Navbar bg="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#home">
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
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form inline>
                        {showIcon
                            ? <ShowUserIcon/>
                            : null}
                        {!showIcon
                            ? <ShowSignUpAndLogIn/>
                            : null}
                        <FormControl type="text" placeholder="Search" className="form-outline"/>

                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;
