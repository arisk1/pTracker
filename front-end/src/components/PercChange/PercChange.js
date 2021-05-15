import React, { Fragment } from 'react'

const PercChange = (props) => {
    const { perc_change } = props
    const color = (perc_change && perc_change >= 0) ? "green" : "red"
    const cname = (perc_change && perc_change >= 0) ? "fas fa-caret-up" : 'fas fa-caret-down'

    return (
        <Fragment>
            {perc_change ? (
                <Fragment>
                    <i class={cname} style={{color}}></i>
                    <span style={{color}}> {Math.abs(perc_change).toFixed(2)}% </span>
                </Fragment>
            )
            : (
                <Fragment>
                    <i class='fas fa-caret-down' style={{color:"red"}}></i>
                    <span style={{color}}> 0% </span>
                </Fragment>
            )
            }
        </Fragment>
    )
}

export default PercChange
