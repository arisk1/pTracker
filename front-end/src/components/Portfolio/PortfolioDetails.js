import React,{Fragment} from 'react';
import {Container,Row,Col,ListGroup,ListGroupItem,Button,Modal} from 'react-bootstrap';
import gear from './gear.png';

const PortfolioDetails = (props) => {

    const portfolio = props.location.state.portfolioDetails;
    

    return(
        <Container>
            <Row className='row-top mr-0 ml-0' >
                <Col>
                    <Row>
                    <Col style={{textAlign : 'left'}}>
                        <h3> {portfolio.name} </h3>
                    </Col>
                    <Col style={{textAlign : 'right'}}>
                        <Button variant="primary">Add Coin</Button>{' '}
                        <Button variant="outline-danger">Remove Coin</Button>{' '}
                        
                    </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default PortfolioDetails;