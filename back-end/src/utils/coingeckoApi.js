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
    pingApi,
    priceOfCoins
}
