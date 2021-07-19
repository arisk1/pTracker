import React from 'react';
import { Fragment } from 'react';
import Chart from "react-google-charts";


const PieChart = (props) => {

    const {coins,portfolioCoins,calculateCurrency} = props;
    const array = coins.map((value,index)=>{
        //match the id of coins array with the coinId of portfolioCoins
        let myindex=0;
        portfolioCoins.forEach((c,idx) => {
            if(value.id === c.coinId){
                console.log(idx)
                myindex=idx;
            }
        });
        return([value.name , calculateCurrency(portfolioCoins[myindex].holdings)])
    });

    return(
    <Fragment>
        {console.log(array)}
    <Chart
        width={'500px'}
        height={'300px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
        data={[
          ['Crypto Portfolio', 'Percentage of Portfolio'],
          ...array
        ]}
        options={{
          title: 'Porfolio Pie Chart Representation',
          // Just add this option
          is3D: true,
        }}
        rootProps={{ 'data-testid': '2' }}
      /></Fragment>)
}

export default PieChart