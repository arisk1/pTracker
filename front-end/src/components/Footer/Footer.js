import {Row, Col, Container} from 'react-bootstrap';

const Footer = () => {
    return (
        <div>
            <Container className='new-footer'>
                <Row className="cop2">
                    <Col>Terms&Service &#8226; Contanct Us</Col>
                </Row>
                <Row className="cop">
                    <Col>©2021 pTracker</Col>
                </Row>
            </Container>
            <Container fluid className="Footer" style={{paddingBottom : '8px'}}>
                <Container
                    style={{
                    padding: '0 20px 0 20px'
                }}>
                    {/* <Row>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Row className="text-md-left">
                                <Col >
                                    randomtext1
                                </Col>

                            </Row>
                            <Row className="text-md-left">
                                <Col >
                                    randomtext1.2
                                </Col>

                            </Row>
                            <Row className="text-md-left">
                                <Col >
                                    randomtext1.3
                                </Col>

                            </Row>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                            <Row className="text-md-right">
                                <Col >
                                    randomtext2
                                </Col>

                            </Row>
                            <Row className="text-md-right">
                                <Col >
                                    randomtext2.1
                                </Col>

                            </Row>
                            <Row className="text-md-right">
                                <Col >
                                    randomtext3.1
                                </Col>

                            </Row>
                        </Col>
                    </Row> */}
                    <Row className="cop">
                        <Col>©2021 pTracker</Col>
                    </Row>
                </Container>
            </Container>
        </div>
    )
}

export default Footer;