import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const ChangePassModal = (props) => {
    const { show, onHide } = props

    return (
        <div>
            <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Change Password
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>wow1</p>
                    <p>wow1</p>
                    <p>wow1</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Close</Button>
                    <Button variant="danger">Save changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

ChangePassModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
}

export default ChangePassModal
