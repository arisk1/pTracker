import React, { useState, useContext, useEffect, useRef} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const PortfolioForm = (props) => {

  const [portfolioName,setPortfolioName] = useState("");

  const addPortfolio= async (e) => {
    e.preventDefault();
     try {
        const res = await axios.post('/portfolios', {
            name : portfolioName
        });
        if(res.status===201){
          props.onHide();
          props.updatePortfolio();
        }
    } catch (err) {
        console.log(err);
    }
  }

    return (
      <Modal
      show={props.show}
      onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Choose a name for your new portfolio
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={addPortfolio} >
        <Form.Group controlId="formBasicPortfolioName">
                        <Form.Label>Portfolio's name</Form.Label>
                        <Form.Control
                            onChange={(e)=>setPortfolioName(e.target.value)}
                            type="text"
                            name="name"
                            placeholder="Enter your portfolio's name..."
                            required/>
                    </Form.Group>
                    <Button variant='dark' size="lg" type="submit" block>
          Add Portfolio   
        </Button>
        </Form>
        </Modal.Body>
      </Modal>
    );
  }

  const PortfolioModal = (props) => {
    const [modalShow, setModalShow] = React.useState(false);
  
    return (
      <>
        <Button onClick={() => setModalShow(true)} className="btn-circle" title="Add a new Portfolio to your list" variant="primary" size="lg" >+</Button>
  
        <PortfolioForm
          show={modalShow}
          onHide={() => setModalShow(false)}
          updatePortfolio={props.updatePortfolio}
        />
      </>
    );
  }

  export default PortfolioModal;