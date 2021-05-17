import React, {useEffect, useState} from 'react';
import  {coinListMarkets } from '@arisk1/cg-functions';
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

const Heatmap = () => {
    // state
    const [data,
        setData] = useState([]);
    const [colors,
        setColors] = useState([]);

    useEffect(() => {
        // fetching only top 100 coins
        const fetchData = async() => {
            const res = await coinListMarkets('usd','market_cap_desc', 1, false);
            setData(
                [{ 
                    name:"coins", 
                    children:res.data.map((coin) => {
                        return { 
                            name:coin.symbol.toUpperCase(), 
                            size:(1/coin.market_cap_rank),
                            fullname: coin.name,
                            price: coin.current_price,
                            perc_change:coin.price_change_percentage_24h_in_currency,
                            volume:coin.total_volume
                        }
                    }) 
                }]
            )
            setColors(res.data.map((coin) => {
                const perc_change = coin.price_change_percentage_24h_in_currency;
                return ComputeColor(perc_change)
            }))
        }
        fetchData();
    },[])

    // coloring
    const ComputeColor = (perc_change) => {
        const greenFlag = (perc_change >=0) ? true : false  //check if green or red
        perc_change = Math.abs(perc_change)                 // get abs value for opacity

        const [max_new, min_new, max_old, min_old] = [1, 0, 15, -15]                        // [-15,15] ~ arbitrary 24h change
        const pc = ((max_new-min_new)/(max_old-min_old)) * (perc_change-max_old) + (max_new)    //project to [0-1] range

        if(greenFlag)
            return `rgb(0,128,0,${pc})`
        else
            return `rgb(255,0,0,${pc})`

    }

    // customized content components
    const CustomMapContent = (props) => {
        const { root, depth, x, y, width, height, index, colors, name, value } = props;

        return (
          <g>
            <rect
              x={x}
              y={y}
              width={width}
              height={height}
              style={{
                fill:
                  depth === 2 ? colors[index] : "none",
                stroke: "#fff"
              }}
            />
            {depth === 2 ? (
              <text
                x={x + width / 2}
                y={y + height / 2 + 7}
                textAnchor="middle"
                fill="#fff"
                fontSize={8+15*value}
              >
                {name}
              </text>
            ) : null}
          </g>
        );
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { perc_change, fullname, volume, price } = payload[0].payload
            const color = (perc_change && perc_change >= 0) ? "green" : "red"
            return (
            <div className="custom-tooltip">
                <h5 style={{backgroundColor:color, color:"white", borderRadius:"3px"}}>{fullname}</h5>
                <p> <span style={{fontWeight:"bold"}}>24h change:</span>     {perc_change.toFixed(2)}%</p>
                <p> <span style={{fontWeight:"bold"}}>Current price:</span>  {price} </p>
                <p> <span style={{fontWeight:"bold"}}>Volume:</span>         {volume.toLocaleString()}</p>
            </div>
          );
        }
        else{ return (<div> </div>) }
    }

    return (
        <div style={{width:"100%", height:750}}>
            <br /><h3>Top 100 Cryptocurrencies Heatmap (24h)</h3><br />
            <ResponsiveContainer height={650}>
                <Treemap
                    data={data}
                    dataKey="size"
                    aspectRatio={4/3}
                    stroke="#fff"
                    isAnimationActive={false}
                    content={<CustomMapContent colors={colors} />}
                >
                    <Tooltip 
                        content={<CustomTooltip />}
                    />
                </Treemap>
            </ResponsiveContainer>
        </div>
    )
}

export default Heatmap
