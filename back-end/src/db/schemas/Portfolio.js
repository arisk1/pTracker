const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim : true
    },
    coins : [{
        coinId : {
            type : String
        },
        holdings : {
            type : Number,
            default : 0
        },
        pnl : {
            type : String,
            default : 0
        }
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