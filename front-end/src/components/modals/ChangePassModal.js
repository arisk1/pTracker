import React, { useState, useContext, useRef } from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';
import AuthContext from '../../context/auth/authContext';
import ShowPass from '../showPass/ShowPass';
import Alert from '../alert/Alert'

const ChangePassModal = (props) => {
    // context
    const authContext = useContext(AuthContext);
    const { update } = authContext;

    const { show, onHide } = props

    // states
    const [formUser, setFormUser] = useState({
        current: '',
        updated: '',
        confirm: ''
    })
    const { current, updated, confirm } = formUser;

    // ref
    const currRef = useRef('')
    const upRef = useRef('')
    const confRef = useRef('')

    const [errorMsg,
        setErrorMsg] = useState(null);
    const [submitted,
        setSubmitted] = useState(false);

    // functions
    const onSubmit = async (e) => {
        // on submit of name or email
        e.preventDefault();
        setSubmitted(true)

        if(updated !== confirm){
            setErrorMsg("Passwords must match!")
        }
        else if(updated === current){
            setErrorMsg("New password must be different from current!")
        }
        else{
            setErrorMsg(null)
            const res = await update({
                password: {
                    current,
                    updated
                }
            })
            if(res.status === 400){
                setErrorMsg(res.data.error);
            }
            else{
                setErrorMsg(null);
                onHide()
            }
        }
    }

    const reset = () => {
        setErrorMsg(null);
        setSubmitted(false)
    }

    const onChange = (e) => {
        setFormUser({...formUser, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={() => reset()}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Change Password
                    </Modal.Title>
                </Modal.Header>

                <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group controlId="formBasicCurrent">
                        <Form.Label>Current Password</Form.Label>
                        <div className="grid-2-pass">
                            <Form.Control
                                onChange={onChange}
                                type="password"
                                name="current"
                                ref={currRef}
                                placeholder="Enter your current password"
                                required
                            />
                            <ShowPass passRef={currRef}/>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="formBasicUpdated">
                        <Form.Label>New Password</Form.Label>
                        <div className="grid-2-pass">
                            <Form.Control
                                onChange={onChange}
                                type="password"
                                name="updated"
                                ref={upRef}
                                placeholder="Enter your new password"
                                required
                            />
                            <ShowPass passRef={upRef}/>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="formBasicConfirm">
                        <Form.Label>Confirm New Password</Form.Label>
                        <div className="grid-2-pass">
                            <Form.Control
                                onChange={onChange}
                                type="password"
                                name="confirm"
                                ref={confRef}
                                placeholder="Confirm new password"
                                required
                            />
                            <ShowPass passRef={confRef}/>
                        </div>
                    </Form.Group>
                    {errorMsg!==null
                    ? <Alert msg={errorMsg} color={"red"} />
                    : null}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Close</Button>
                    <Button variant="danger" type="submit">Save changes</Button>
                </Modal.Footer>
                </Form>
            </Modal>
        </div>
    )
}

ChangePassModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
}

export default ChangePassModal
