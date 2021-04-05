const  {pingApi , coinList, priceOfCoins }= require("./coingeckoApi");
    //promise
    const a = async() => {
        try{
            const b = await pingApi();
            const c = await coinList();
            const d = await priceOfCoins(["bitcoin","ethereum"],["usd","eur"]);
            console.log(b)
            console.log(c);
            console.log(d);     
        }catch(e) {
            console.log(e)
        }
    }

     a();