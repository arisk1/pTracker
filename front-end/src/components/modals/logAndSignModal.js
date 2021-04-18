import {Modal, Button, Form} from 'react-bootstrap';
import logo from '../Header/orbz_moon.png';
import React, {useState} from 'react';
import axios from 'axios';

function LogAndSignModal(props) {

    const [email,
        setEmail] = useState("");
    const [password,
        setPassword] = useState("");
    const [errorMsg,
        setErrorMsg] = useState(false);
    const [errorValMsg,
        setErrorValMsg] = useState(0);
    const [name,
        setName] = useState("");

    const rotateModals = () => {
        props.rotate();
        setErrorMsg(false);
    }

    const resetErrorHandlers=()=>{
        setErrorMsg(false);
        setErrorValMsg(0);
    }

    const ShowError = () => {
        return (
            <Form.Text
                className=""
                style={{
                color: "red",
                paddingBottom: "1vh",
                fontSize: "14px"
            }}>
                Wrong credentrial please try again or
                <Button variant="link" className="p-1" onClick={() => rotateModals()}>
                    Sign Up
                </Button>
            </Form.Text>
        );
    }

    const ShowValidationError = () => {
        if(errorValMsg===1){ //1 email error
            return (
                <Form.Text
                    className=""
                    style={{
                    color: "red",
                    paddingBottom: "1vh",
                    fontSize: "14px"
                }}>
                    Someone has already signed up with this email.
                </Form.Text>
            );
        }else if(errorValMsg===2){ //2 password error
            return (
                <Form.Text
                    className=""
                    style={{
                    color: "red",
                    paddingBottom: "1vh",
                    fontSize: "14px"
                }}>
                    Password must be longer than 6 characters and must not contain the word password
                </Form.Text>
            );
        }
        
    }

    const SignUpText = () => {
        return (
            <div>
                <h3>Welcome to pTracker.</h3>
                <p style={{
                color: "grey",
                fontSize : '16px'
            }}>Already have an account?
                <Button variant="link" className="p-1" onClick={() => rotateModals()}>
                    Log In
                </Button></p>
            </div>
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
        } catch (error) {
            if (error.response) {
                if(error.response.data.name==="MongoError"){
                    //email is already used
                    setErrorValMsg(1);
                }else if(error.response.data.name==="ValidationError"){
                    //password error  : !password , length >= 6
                    setErrorValMsg(2);
                }
            }
            console.log(error);
        }
    }

    const callHandler = (e) => {
        e.preventDefault();
        if (props.loginVar) {
            fetchUser();
        } else {
            signUpUser();
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={() => resetErrorHandlers()}>
            <Modal.Header closeButton>
                <Modal.Title
                    id="contained-modal-title-vcenter"
                >
                    <img
                        alt="pTracker-logo"
                        src={logo}
                        width="40"
                        height="40"
                        className="d-inline-block align-middle"/> 
                        {props.loginVar
                        ? null
                        : <SignUpText/>}

                </Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={callHandler}>
                    {props.loginVar
                        ? null
                        : <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter your name"/>
                    </Form.Group>}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter email"/>
                    </Form.Group>
                    {(errorValMsg===1)
                        ? <ShowValidationError/>
                        : null}
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"/>
                    </Form.Group>
                    {(errorValMsg===2)
                        ? <ShowValidationError/>
                        : null}
                    {errorMsg
                        ? <ShowError/>
                        : null}
                    <Button variant="dark" size="lg" type="submit" block>
                        {props.loginVar
                            ? "Log In"
                            : "Sign Up"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default LogAndSignModal;