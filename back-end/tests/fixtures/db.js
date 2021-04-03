const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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

// const task1 = {
//     _id : new mongoose.Types.ObjectId(),
//     description: 'First task',
//     completed : false ,
//     owner : user1Id
// }
// const task2 = {
//     _id : new mongoose.Types.ObjectId(),
//     description: 'Second task',
//     completed : true ,
//     owner : user1Id
// }

// const task3 = {
//     _id : new mongoose.Types.ObjectId(),
//     description: 'Third task',
//     completed : true ,
//     owner : user2Id
// }



const populateDatabase = async () => {
    //clean the database
    await User.deleteMany();
    // await Task.deleteMany();
    //add 2 users + 3 tasks for testing
    await new User(user1).save();
    await new User(user2).save();
    // await new Task(task1).save();
    // await new Task(task2).save();
    // await new Task(task3).save();

}


module.exports = {
    user1Id,user2Id,
    user1,user2,
    // task1,task2,task3,
    populateDatabase
}