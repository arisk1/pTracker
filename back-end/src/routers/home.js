const express = require('express');
const router = new express.Router();
const  {coinListMarkets }= require("../utils/coingeckoApi.js");


//homepage with the top 100 coins
//sorted by marketcap

router.get('/home', async (req, res) => {
    try{
        const coins = await coinListMarkets();
        res.status(200).send(coins.data);
    }catch(e){
        res.status(400).send(e);
    }
});

module.exports = router