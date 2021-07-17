import React from 'react'
import {
    LineChart,
    Line,
    ResponsiveContainer,
    YAxis
  } from "recharts";

const SmallPriceChart = (props) => {
    const { perc_change, sparkline,width } = props
    const color = (perc_change && perc_change >= 0) ? "green" : "red"

    const data = (sparkline!==undefined)
    ?  [...sparkline.price].map((single_price, index) => {
        return {"name": index, "value":single_price}
    })
    : null

    return (
            <div style={{width:width, height:80}}>
            <ResponsiveContainer width="100%">
                <LineChart
                    margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
                    data={data} >
                    <YAxis domain={['dataMin', 'dataMax']} hide="true"/>
                    <Line type="linear" stroke={color} dataKey="value" dot={false} />
                </LineChart>
            </ResponsiveContainer>
            </div>
    )
}

export default SmallPriceChart
