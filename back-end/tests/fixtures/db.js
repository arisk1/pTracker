const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Portfolio = require('../../src/db/schemas/Portfolio');
const User = require('../../src/db/schemas/User');

const user1Id = new mongoose.Types.ObjectId();
const user1 = {
    _id: user1Id,
    name: "user1",
    email: "user1@test.com",
    password: "CoDe123!haAhAa",
    tokens: [{
        token: jwt.sign({
            _id: user1Id
        }, process.env.JWT_SECRET)
    }]
}

const user2Id = new mongoose.Types.ObjectId();
const user2 = {
    _id: user2Id,
    name: "user2",
    email: "user2@test.com",
    password: "CoDe123!haAhAa",
    tokens: [{
        token: jwt.sign({
            _id: user2Id
        }, process.env.JWT_SECRET)
    }]
}

const portfolio1 = {
    _id : new mongoose.Types.ObjectId(),
    sumOfPortfolio: 2618.22,
    sumPosition: 4000,
    sumPnL: -1381.7800000000002,
    sumOfPortfolioChange: 2912.077422941303,
    portfolioChange: -293.8574229413034,
    name: 'First p',
    owner : user1Id,
    coins: [
        {
            quantity: 1,
            holdings: 2618.22,
            sumPositionOfCoin: 4000,
            sumPnLOfCoin: -1381.7800000000002,
            _id: "60a28ee3da5a3c488beba239",
            coinId: "ethereum",
            history: [
                {
                    fees: 0,
                    cost: 4000,
                    proceeds: 0,
                    pnl: -1381.7800000000002,
                    _id: "60a28ef5da5a3c488beba23a",
                    transaction: "buy",
                    price: 4000,
                    quantity: 1,
                    date: "2021-05-16T09:26:06.824Z"
                }
            ]
        }
    ]
}
const portfolio2 = {
    _id : new mongoose.Types.ObjectId(),
    name: 'Second p',
    owner : user1Id,
    coins : [{
        coinId : "ethereum",
        holdings : 0,
        pnl : 0 
    }]
}

const portfolio3 = {
    _id : new mongoose.Types.ObjectId(),
    name: 'Third p',
    owner : user2Id,
    coins : [{
        coinId : "ethereum",
        holdings : 0,
        pnl : 0 
    }]
}



const populateDatabase = async () => {
    //clean the database
    await User.deleteMany();
     await Portfolio.deleteMany();
    //add 2 users + 3 portfolios for testing
    await new User(user1).save();
    await new User(user2).save();
    await new Portfolio(portfolio1).save();
    await new Portfolio(portfolio2).save();
    await new Portfolio(portfolio3).save();

}


module.exports = {
    user1Id,user2Id,
    user1,user2,
    portfolio1,portfolio2,portfolio3,
    populateDatabase
}