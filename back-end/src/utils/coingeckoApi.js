const request = require("request");

const apiUrl = "https://api.coingecko.com/api/v3";

const coinList = () =>{
    return new Promise((resolve,reject)=>{
        const url = apiUrl + "/coins/list";
        request({ url: url, json: true }, (error, res) => {
            if (error) {
                reject("Unable to connect to coingecko api service!");
            }
            else {
                const data = res.body;
                resolve(data)
            }
        });
    })  
}

const coinListMarkets = (currency,order) =>{
    return new Promise((resolve,reject)=>{
        //default 
        //vs_currency=usd 
        //order=market_cap_desc
        const url = apiUrl + "/coins/markets?vs_currency="+ (currency ? currency : "usd")+"&order="+ (order ? order : "market_cap_desc") +"market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C14d";
        
        request({ url: url, json: true }, (error, res) => {
            if (error) {
                reject("Unable to connect to coingecko api service!");
            }
            else {
                const data = res.body;
                resolve(data)
            }
        });
    })  
}
const pingApi = () =>{
    return new Promise((resolve,reject)=>{
        const url = apiUrl + "/ping";
        request({ url: url, json: true }, (error, res) => {
            if (error) {
                // cb("Unable to connect to coingecko api service!",undefined);
                reject("Unable to connect to coingecko api service!");
            }
            try {
                const data = res.body;
                // cb(undefined,data)
                resolve(data);
            }catch(e){
                reject("Unable to connect to coingecko api service!");
            }
        });
    })
       
}
const priceOfCoins = (coins ,currency) =>{
    return new Promise((resolve,reject)=>{
        const url = apiUrl + "/simple/price?ids="+coins.join('%2C')+"&vs_currencies="+currency.join('%2C')+"&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true";
        request({ url: url, json: true }, (error, res) => {
            if (error) {
                reject("Unable to connect to coingecko api service!");
            }
            else {
                const data = res.body;
                resolve(data)
            }
        });
    })
    
}

module.exports = {
    coinList,
    coinListMarkets,
    pingApi,
    priceOfCoins
}
