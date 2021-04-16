import {Navbar,Nav,NavDropdown,Form,FormControl,Button, Container} from 'react-bootstrap';
import logo from './orbz_moon.png';
import LogIn from '../LogIn/logIn.js';
import SignUp from '../SignUp/signUp.js';
import userIcon from './userIcon.png';
import { useState } from 'react';



function Header() {

    const [showIcon , setShowIcon] = useState(false);
    const ShowUserIcon = () => {
      return (
        <img
        alt="pTracker-logo"
        src={userIcon}
         width="30"
        height="30"
        className="d-inline-block align-middle user-img"
        
      />
      );
    }
    const ShowSignUpAndLogIn = () => {
      return (
        <>
        <LogIn  
          showUserIcon={() => setShowIcon(true)} 
        />
        <SignUp  
          showUserIcon={() => setShowIcon(true)} 
        />
        </>
      )
    }

    return (
       
  <Navbar  bg="dark" expand="lg">
    <Container>
  <Navbar.Brand href="#home" >
        <img
        alt="pTracker-logo"
        src={logo}
         width="40"
        height="40"
        className="d-inline-block align-middle"
      />
    pTracker</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="/">Home</Nav.Link>
      <NavDropdown title="Dropdown" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
    </Nav>
    <Form inline  >
      { showIcon ? <ShowUserIcon/>   : null }
      { !showIcon ? <ShowSignUpAndLogIn/>  : null }
    <FormControl type="text" placeholder="Search" className="form-outline" />
      
    </Form>
  </Navbar.Collapse>
  </Container>
</Navbar>
    )
}

export default Header;
