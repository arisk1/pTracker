import {Container, ListGroup, ListGroupItem,Row,Col} from 'react-bootstrap';

function CoinList (coins) {
    const topInfo = () => {
        if(coins.length>0){
            return(
                <ListGroup.Item style={{backgroundColor : '#C0C0C0'}}>
                    <Row >
                        <Col>Rank(by MCap)</Col>
                        <Col>Symbol</Col>
                        <Col>Coin</Col>
                        <Col>Price</Col>
                        <Col>MarketCap </Col>
                    </Row> 
                </ListGroup.Item>
            )
        }
    }
    return (

<ListGroup >
{topInfo()}
{coins.map(coin => (
        <ListGroup.Item>
                <Row className="align-items-center">
                    <Col>{coin.market_cap_rank}</Col>
                    <Col><img className="img" src={coin.image}/></Col>
                    <Col>{coin.id}</Col>
                    <Col>{coin.current_price}</Col>
                    <Col>{coin.market_cap} </Col>
                </Row>
        </ListGroup.Item>
))}
</ListGroup>
    )
}

export default CoinList;

