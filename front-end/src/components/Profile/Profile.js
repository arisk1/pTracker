import React, { useContext, useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import AuthContext from '../../context/auth/authContext';
import ChangePassModal from '../modals/ChangePassModal';

const Profile = () => {
    // context
    const authContext = useContext(AuthContext);
    const { update, loadUser, user } = authContext;

    //states
    const [formUser, setFormUser] = useState({
        name: '',
        email: ''
    })
    const { name, email } = formUser;

    const [errorMsg,
        setErrorMsg] = useState(null);
    const [successMsg,
        setSuccessMsg] = useState(null);
    const [modalShow,
        setModalShow] = useState(false);

    useEffect(() => {
        loadUser()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if(user){
            setFormUser({
                name: user.name,
                email: user.email
            })
        }
        // eslint-disable-next-line
    }, [user])

    // functions
    const ShowError = () => {
        return (
            <Form.Text
                style={{
                color: "red",
                paddingBottom: "1vh",
                fontSize: "14px"
            }}>
                {errorMsg}
            </Form.Text>
        );
    }

    const ShowSuccess = () => {
        return (
            <Form.Text
                style={{
                color: "green",
                paddingBottom: "1vh",
                fontSize: "14px"
            }}>
                {successMsg}
            </Form.Text>
        );
    }

    const callHandler = async (e) => {
        e.preventDefault();
        if(!modalShow){                     // to avoid calling this with password change
            const res = await update({
                name,
                email
            })
            if(res.status === 400){
                setErrorMsg(res.data.error);
            }
            else{
                setErrorMsg(null);
                console.log("Success!")
                setSuccessMsg("Success!")
                setInterval(function(){ setSuccessMsg(null) }, 3000);
            }
        }
    }

    const onChange = (e) => {
        setFormUser({...formUser, [e.target.name]: e.target.value })
    }

    return (
        <div>       
            <div className='info-container'>
                <br /><h3>Profile Info </h3><br />
                <Form onSubmit={callHandler}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            onChange={onChange}
                            type="text"
                            name="name"
                            value={name}
                            placeholder="Enter your name"
                            required
                            />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            onChange={onChange}
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            required
                            />
                    </Form.Group>
                    {errorMsg!==null
                        ? <ShowError/>
                        : null}
                    {successMsg!==null
                        ? <ShowSuccess />
                        : null}
                    <div className="info-container">
                        <Button variant="dark" size="lg" type="submit" block>
                            Save
                        </Button>
                        <br />
                        <Button variant="danger" size="lg" onClick={() => setModalShow(true)} block>
                            Change Password
                        </Button>
                        <ChangePassModal
                            show = {modalShow}
                            onHide = {() => setModalShow(false)}
                        />
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default Profile
