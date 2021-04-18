import { ListGroup,Row, Col} from 'react-bootstrap';

function CoinList(coins) {
    const topInfo = () => {
        if (coins.length > 0) {
            return (
                <ListGroup.Item
                    style={{
                    backgroundColor: '#C0C0C0'
                }}>
                    <Row >
                        <Col
                            style={{
                            textAlign: 'left'
                        }}>#</Col>
                        <Col>Symbol</Col>
                        <Col>Coin</Col>
                        <Col>Price</Col>
                        <Col
                            style={{
                            textAlign: 'right'
                        }}>MarketCap
                        </Col>
                    </Row>
                </ListGroup.Item>
            )
        }
    }
    return (

        <ListGroup variant="flush">
            {topInfo()}
            {coins.map((coin,idx) => (
                <ListGroup.Item key={idx} >
                    <Row className="align-items-center">
                        <Col
                            style={{
                            textAlign: 'left'
                        }}>{coin.market_cap_rank}</Col>
                        <Col><img alt={coin.id} className="img" src={coin.image}/></Col>
                        <Col>{coin.id}</Col>
                        <Col>{coin.current_price}</Col>
                        <Col
                            style={{
                            textAlign: 'right'
                        }}>${coin.market_cap}
                        </Col>
                    </Row>
                </ListGroup.Item>
            ))}
        </ListGroup>
    )
}

export default CoinList;
