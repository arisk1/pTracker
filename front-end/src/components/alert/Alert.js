import React from 'react'

const Alert = (props) => {
    const { msg, color } = props

    return (
        <p style={{
            color,
            paddingBottom: "1vh",
            fontSize: "14px"}}>
            {msg}
        </p>
    )
}

export default Alert
