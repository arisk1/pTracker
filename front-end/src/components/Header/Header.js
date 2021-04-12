import {Navbar,Nav,NavDropdown,Form,FormControl,Button, Container} from 'react-bootstrap';
import logo from './orbz_moon.png';

function Header() {
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
      <FormControl type="text" placeholder="Search" className="mr-sm-2 form-outline" />
      <Button variant="outline-dark">Search</Button>
    </Form>
  </Navbar.Collapse>
  </Container>
</Navbar>
    )
}

export default Header;
