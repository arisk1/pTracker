import React from 'react';
import {Button,Row,Col} from 'react-bootstrap';
import { Link} from 'react-router-dom';
import backArrow from './back2.png';

const GoBack = (props) => {

    const {buttonText,pathTo} = props

    return(
        <Row>
            <Col style={{textAlign : 'left'}} >
                <Button className='pl-0 px-20' variant="" as={Link} to={{pathname:pathTo}} >{buttonText}
                    <img
                        alt="backArrow-logo"
                        src={backArrow}
                        width="15"
                        height="15"
                        className="d-inline-block align-middle"/>
                </Button>
            </Col>
        </Row>
    )
}

export default GoBack
