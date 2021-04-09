const axios = require('axios');

const apiUrl = "https://api.coingecko.com/api/v3";

const coinList =async () => {
    const url = apiUrl + "/coins/list";
    try {
        return await axios.get(url)
    } catch (error) {
        console.error(error)
    }
}

const coinListMarkets = async (currency, order) => {
    const url = apiUrl + "/coins/markets?vs_currency=" + (currency ? currency : "usd") + "&order=" + (order ? order : "market_cap_desc") + "market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h%2C7d%2C14d";
    try {
        return await axios.get(url);
        
    } catch (error) {
        console.error(error)
    }
}
const pingApi = async () => {
    const url = apiUrl + "/ping";
    try {
        return await axios.get(url)
    } catch (error) {
        console.error(error)
    }
}
const priceOfCoins = async (coins, currency) => {
    const url = apiUrl + "/simple/price?ids=" + coins.join('%2C') + "&vs_currencies=" + currency.join('%2C') + "&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true";
    try {
        return await axios.get(url)
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    coinList,
    coinListMarkets,
    pingApi,
    priceOfCoins
}