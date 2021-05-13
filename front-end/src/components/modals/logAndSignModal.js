import { Modal, Button, Form } from 'react-bootstrap';
import logo from '../Header/orbz_moon.png';
import PropTypes from 'prop-types';
import React, { useState, useContext, useEffect, useRef} from 'react';
import AuthContext from '../../context/auth/authContext';
import ShowPass from '../showPass/ShowPass';
import Alert from '../alert/Alert'

const LogAndSignModal = (props) => {
    // context
    const authContext = useContext(AuthContext);
    const { login, signup, error, isAuthenticated } = authContext;

    // states
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    })
    const passRef = useRef('')

    const [errorMsg,
        setErrorMsg] = useState(false);
    const [errorValMsg,
        setErrorValMsg] = useState(null);

    const { name, email, password } = user;
    const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value })

    useEffect(() => {
        if(isAuthenticated){
            props.onHide();
        }
        // eslint-disable-next-line
    }, [error, isAuthenticated])


    const rotateModals = () => {
        props.rotate();
        resetErrorHandlers();
    }

    const resetErrorHandlers=()=>{
        setErrorMsg(false);
        setErrorValMsg(null);
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
                Wrong credentrials please try again or
                <Button variant="link" className="p-1" onClick={() => rotateModals()}>
                    Sign Up
                </Button>
            </Form.Text>
        );
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

    const callHandler = async (e) => {
        e.preventDefault();
        if (props.loginVar) {
            const res = await login({
                email,
                password
            })
            if(res.status === 400){
                setErrorMsg(true);
            }
        } else {
            const res = await signup({
                email,
                password,
                name
            })
            if(res.status === 400){
                if(res.data.name==="MongoError"){
                    setErrorValMsg("Someone has already signed up with this email.");
                }else if(res.data.name==="ValidationError"){
                    setErrorValMsg("Password must be longer than 6 characters and must not contain the word password");
                }
            }
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
                            onChange={onChange}
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            required/>
                    </Form.Group>}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            onChange={onChange}
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            required/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <div className="grid-2-pass">
                            <Form.Control
                            onChange={onChange}
                            type="password"
                            name="password"
                            ref={passRef}
                            placeholder="Password"
                            required/>
                            <ShowPass passRef={passRef}/>
                        </div>
                    </Form.Group>
                    {(errorValMsg!==null)
                        ? <Alert msg={errorValMsg} color={"red"} />
                        : null}
                    {errorMsg
                        ? <ShowError />
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

// prop types
LogAndSignModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    loginVar: PropTypes.bool.isRequired,
    rotate: PropTypes.func.isRequired
}

export default LogAndSignModal;