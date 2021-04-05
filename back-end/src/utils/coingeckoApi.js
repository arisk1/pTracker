const request = require("request");

const apiUrl = "https://api.coingecko.com/api/v3";
const coinList = (cb) =>{
    const url = apiUrl + "/coins/list";
    request({ url: url, json: true }, (error, res) => {
        if (error) {
            cb("Unable to connect to coingecko api service!",undefined);
        }
        else {
            const data = res.body;
            cb(undefined,data)
        }
    });
}

const pingApi = (cb) =>{
        const url = apiUrl + "/ping";
        request({ url: url, json: true }, (error, res) => {
            if (error) {
                cb("Unable to connect to coingecko api service!",undefined);
            }
            else {
                const data = res.body;
                cb(undefined,data)
            }
        });
}

const priceOfCoins = (coins ,currency, cb) =>{
    
    const url = apiUrl + "/simple/price?ids="+coins.join('%2C')+"&vs_currencies="+currency.join('%2C')+"&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true";
    request({ url: url, json: true }, (error, res) => {
        if (error) {
            cb("Unable to connect to coingecko api service!",undefined);
        }
        else {
            const data = res.body;
            cb(undefined,data)
        }
    });
}



module.exports = {
    coinList,
    pingApi,
    priceOfCoins
}
