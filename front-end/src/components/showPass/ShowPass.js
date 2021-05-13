import React, { useRef } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ShowPass = (props) => {
    const { passRef } = props
    const eyeRef = useRef('')

    // show password
    const showPassFunc = () => {
        if(passRef.current.type === "password"){
            passRef.current.type = "text"
            eyeRef.current.className += " green-color"
        } else{
            passRef.current.type = "password"
            eyeRef.current.className = "far fa-eye"
        }
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Show password
        </Tooltip>
    )

    return (
        <div>
            <OverlayTrigger
                placement="right"
                delay={{ show: 500, hide: 50 }}
                overlay={renderTooltip}>
                <i className="far fa-eye" ref={eyeRef} onClick={showPassFunc}></i>
            </OverlayTrigger>
        </div>
    )
}

export default ShowPass
