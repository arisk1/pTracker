const mongoose = require('mongoose');
const {priceOfCoins} = require('@arisk1/cg-functions');

const portfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim : true
    },sumOfPortfolio : {
        type : Number , 
        default : 0
    },sumPosition : {
        type : Number,
        default : 0
    },sumPnL : {
        type : Number,
        default : 0
    },sumOfPortfolioChange : {
        type : Number,
        default : 0
    },portfolioChange : {
        type : Number ,
        default : 0
    }
    ,
    coins : [{
        coinId : {
            type : String
        },
        quantity : {
            type : Number ,
            default : 0
        },
        holdings : {
            type : Number,
            default : 0
        },
        sumPositionOfCoin : {
            type : Number,
            default : 0
        },
        sumPnLOfCoin : {
            type : Number,
            default : 0
        },
        history : [{
            transaction :{
                type : String
            },
            price : {
                type : Number 
            },quantity : {
                type : Number
            },fees : {
                type : Number,
                default : 0
            },cost : {
                type : Number,
                default : 0
            },proceeds : {
                type : Number,
                default : 0
            },pnl : {
                type : Number,
                default : 0
            },
            date : {
                type : Date,
                default : Date.now
            }
        }]
    }],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User' //reference to onother model
    }
},{
    timestamps : true
});

portfolioSchema.methods.addCoin = async function(coin) {
    const portfolio = this ;
    portfolio.coins = portfolio.coins.concat({coinId : coin});
    await portfolio.save();
    return portfolio.coins;
}

portfolioSchema.methods.fetchPortfolio = async function(currency){
    const portfolio = this;
    let iterator = 0;
    let len = portfolio.coins.length;
    //first turn sum to 0
    portfolio.sumOfPortfolio = 0;
    portfolio.sumOfPortfolioChange = 0;
    while(len > 0){
            //get currenct price of coin in the selected currency
        let price = await priceOfCoins([portfolio.coins[iterator].coinId],[currency]);
        let priceChange = price.data[portfolio.coins[iterator].coinId][(currency + "_24h_change")];
        let previousPrice = ((price.data[portfolio.coins[iterator].coinId][currency] )*100) / (100 + priceChange);
            //and update the holdings of that coin 
        portfolio.coins[iterator].holdings = portfolio.coins[iterator].quantity * price.data[portfolio.coins[iterator].coinId][currency]; 
            //calculate pnl for every coin 
        portfolio.coins[iterator].sumPnLOfCoin = portfolio.coins[iterator].holdings - portfolio.coins[iterator].sumPositionOfCoin
            //calculate pnl for every transaction made regarding this coin
        let historyLen = portfolio.coins[iterator].history.length;
        let historyIterator = 0;
        while(historyLen > 0){
            //we got the current price of the coin in price variable
            portfolio.coins[iterator].history[historyIterator].pnl =  ((portfolio.coins[iterator].history[historyIterator].quantity)* price.data[portfolio.coins[iterator].coinId][currency]) - portfolio.coins[iterator].history[historyIterator].cost;
            historyIterator+=1;
            historyLen-=1;
        }
            //then add to the sum of the portfolio
        portfolio.sumOfPortfolio += portfolio.coins[iterator].holdings;
        portfolio.sumOfPortfolioChange += previousPrice * portfolio.coins[iterator].quantity;
        iterator+=1;
        len-=1;
    }   
    //pnl for the portfolio
    portfolio.sumPnL = portfolio.sumOfPortfolio - portfolio.sumPosition;
    //24hr portfolio change
    portfolio.portfolioChange = portfolio.sumOfPortfolio - portfolio.sumOfPortfolioChange;
    await portfolio.save();
    return portfolio;
}

portfolioSchema.methods.transaction = async function(typeOfTransaction,coin,quantity,pricePerCoin,date){
    const portfolio = this;
    //find the coin in the portfolio's coin's array
    //and execute the transaction
    if(typeOfTransaction === "buy"){
        portfolio.coins = portfolio.coins.map((arrayObject)=>{
            if(arrayObject.coinId === coin){
                arrayObject.quantity = Number(arrayObject.quantity) + Number(quantity);
                arrayObject.sumPositionOfCoin += quantity*pricePerCoin; //update position for coin 
                portfolio.sumPosition += quantity*pricePerCoin; //update global portfolio position
                arrayObject.history = arrayObject.history.concat({
                    transaction : typeOfTransaction,
                    price : pricePerCoin,
                    quantity : quantity,
                    cost : quantity*pricePerCoin,
                    date : date
                });
            }
            return arrayObject;
        })
        await portfolio.save();
    }else if(typeOfTransaction === "sell"){
        portfolio.coins = portfolio.coins.map((arrayObject)=>{
            if(arrayObject.coinId === coin){
                //do not allow user to sell more than he owns!
                if(quantity > arrayObject.quantity){
                    throw new Error('Insufficient Funds!');
                }
                arrayObject.quantity = Number(arrayObject.quantity) - Number(quantity);
                arrayObject.history = arrayObject.history.concat({
                    transaction : typeOfTransaction,
                    price : pricePerCoin,
                    quantity : quantity,
                    proceeds : quantity*pricePerCoin,
                    date : date
                    //cost is 0
                });
            }
            return arrayObject;
        })
        await portfolio.save();
    }else{
        //typeOfTransaction -> transfer 
        if(typeOfTransaction === "transferin"){ //transfer in
            portfolio.coins = portfolio.coins.map((arrayObject)=>{
                if(arrayObject.coinId === coin){
                    arrayObject.quantity += quantity;
                    arrayObject.history = arrayObject.history.concat({
                        transaction : typeOfTransaction,
                        price : pricePerCoin,
                        quantity : quantity,
                        date : date
                        //cost is 0 
                    });
                }
                return arrayObject;
            })
            await portfolio.save();
        }else { //transfer out
            portfolio.coins = portfolio.coins.map((arrayObject)=>{
                if(arrayObject.coinId === coin){
                //do not allow user to sell more than he owns!
                if(quantity > arrayObject.quantity){
                    throw new Error('Insufficient Funds!');
                }
                arrayObject.quantity -= quantity;
                arrayObject.history = arrayObject.history.concat({
                    transaction : typeOfTransaction,
                    price : pricePerCoin,
                    quantity : quantity,
                    date : date
                    //cost is 0
                });
                }
                return arrayObject;
            })
            await portfolio.save();
        }

    }
    return portfolio;
}

portfolioSchema.methods.removeCoin = async function(coin) {
    const portfolio = this ;
    portfolio.coins = portfolio.coins.filter((p) => {
        return p.coinId != coin;
    });
    await portfolio.save();
    return portfolio.coins;
}

const Portfolio = mongoose.model("Portfolio",portfolioSchema);

module.exports = Portfolio;