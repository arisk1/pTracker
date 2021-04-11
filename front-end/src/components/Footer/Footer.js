import {Row,Col,Container} from 'react-bootstrap';



function Footer() {
    return(
        <Container fluid className="Footer footerbg ">
            <Row>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Row className="text-md-left" >
                    <Col  > randomtext1 </Col>

                    </Row>
                    <Row className="text-md-left">
                    <Col  > randomtext1.2 </Col>

                    </Row>
                    <Row className="text-md-left">
                    <Col  > randomtext1.3 </Col>

                    </Row>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                    <Row className="text-md-right" >
                    <Col  > randomtext2 </Col>

                    </Row>
                    <Row className="text-md-right">
                    <Col > randomtext2.1 </Col>

                    </Row>
                    <Row className="text-md-right">
                    <Col > randomtext3.1 </Col>

                    </Row>
                </Col>
            </Row>
            <Row className="cop">
                <Col>Copyright 2021©</Col>
            </Row>
        </Container>
    )
}

export default Footer;