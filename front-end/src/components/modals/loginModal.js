import {Modal, Button, Form} from 'react-bootstrap';
import logo from '../Header/orbz_moon.png';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

function LoginModal(props) {

    const [email,
        setEmail] = useState("");
    const [password,
        setPassword] = useState("");
    const [errorMsg,
        setErrorMsg] = useState(false);

    const ShowError = () => {
        return (
            <Form.Text
                className=""
                style={{
                color: "red",
                paddingBottom: "1vh",
                fontSize: "14px"
            }}>
                Wrong credentrial please try again or Sign up.
            </Form.Text>
        );
    }

    const fetchUser = async() => {
        try {
            const res = await axios.post('http://localhost:3001/users/login', {
                "email": email,
                "password": password
            });
            console.log(res.data);
            props.onHide();
            props.showUserIcon();
            props.setUser(res.data);
        } catch (e) {
            setErrorMsg(true);
            console.log(e.message)
        }
    }

    const loginHandler = (e) => {
        e.preventDefault();
        fetchUser();
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={() => setErrorMsg(false)}>
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
                <Form onSubmit={loginHandler}>
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

                    {errorMsg
                        ? <ShowError/>
                        : null}
                    <Button variant="dark" size="lg" type="submit" block>
                        Log In
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;