import React, {useState} from 'react';
import axios from 'axios';
import {Modal, Button, Form} from 'react-bootstrap';
import logo from '../Header/orbz_moon.png';



function SignUpModal(props) {

    const [email,
        setEmail] = useState("");
    const [password,
        setPassword] = useState("");
    const [name,
        setName] = useState("");

    const signUpUser = async() => {
        try {
            const res = await axios.post('http://localhost:3001/users', {
                "email": email,
                "password": password,
                "name": name
            });
            console.log(res.data);
            props.onHide(); 
            props.showUserIcon(); 
            props.setUser(res.data);
        } catch (e) {
            // setErrorMsg(true);
            console.log(e.message)
        }
    }

    const signUpHandler = (e) => {
        e.preventDefault();
        signUpUser();
    }
    return (<> 
    <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <img
                        alt="pTracker-logo"
                        src={logo}
                        width="40"
                        height="40"
                        className="d-inline-block align-middle"/>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={signUpHandler}>
                <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter your name"/>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter email"/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"/>
                    </Form.Group>

                    <Button variant="dark" size="lg" type="submit" block>
                        Sign Up
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    </>)

}

export default SignUpModal;