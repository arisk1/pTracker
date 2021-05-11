import React, { useContext, useState, useEffect } from 'react'
import { Button, Form } from 'react-bootstrap';
import AuthContext from '../../context/auth/authContext';

const Profile = () => {
    // context
    const authContext = useContext(AuthContext);
    const { update } = authContext

    //states
    const [user, setUser] = useState({
        name: '',
        email: ''
    })
    const { name, email } = user;

    useEffect(() => {
        // set current user equal to global
        setUser({
            name: authContext.user.name,
            email: authContext.user.email
        })
        // eslint-disable-next-line
    }, [])

    // functions
    const callHandler = async (e) => {
        e.preventDefault();
        const res = await update({
            name,
            email
        })
        console.log(res)
    }

    const onChange = (e) => setUser({...user, [e.target.name]: e.target.value })

    return (
        <div>       
            <div className="grid-2">
                <div>
                    {/* <div>
                        <h5>Values preview</h5>
                        <p>{user && name}</p>
                        <p>{user && email}</p>
                    </div> */}
                    <h3>Personal Info</h3><br />
                    <Form onSubmit={callHandler}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            onChange={onChange}
                            type="text"
                            name="name"
                            value={name}
                            placeholder="Enter your name"
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
                            />
                    </Form.Group>
                    <Button variant="dark" size="lg" type="submit" block>
                        Save
                    </Button>
                </Form>
                </div>

                <p>duo</p>
            </div>
        </div>
    )
}

export default Profile
