const  {pingApi , coinList, priceOfCoins }= require("./coingeckoApi");


    priceOfCoins(["bitcoin","ethereum"],["usd","eur"],(error,res)=>{
        if(!error){
            console.log(res)
        }else{
            console.log("A")
        }
    })

