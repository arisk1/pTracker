import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div>
            <br />
            <i className="far fa-grin-beam-sweat" />{" "}<i className="far fa-grin-beam-sweat" />{" "}<i className="far fa-grin-beam-sweat" />
            <h3>Oops, this page does not exist</h3><br />
            <h5>Click
            {" "}<Link to="/" style={{fontWeight:"bold"}}>here</Link>{" "}
            to go back.</h5>
        </div>
    )
}

export default NotFound
