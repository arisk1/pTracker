import React from 'react'
import mock_data_btc from '../../mock_data/mock_data_btc'
// import mock_data_matic from '../../mock_data/mock_data_matic'
import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis, YAxis, CartesianGrid
  } from "recharts";

const SmallPriceChart = () => {
    // mock_data here represents the sparkline --> this operation must occur when loading data from coingecko
    const data = [...mock_data_btc.price].map((single_price, index) => {
        return {"name": index, "value":single_price}
    })
    const day_change = "-24%"
    const color = parseInt(day_change) > 0 ? "green" : "red"

    return (
            <div style={{width:150, height:80}}>
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
