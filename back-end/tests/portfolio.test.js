const request = require('supertest');
const app = require('../src/app');
const Portfolio = require('../src/db/schemas/Portfolio');
const {
    user1Id,
    user1,
    populateDatabase,
    user2Id,
    user2,
    portfolio1,portfolio2,portfolio3
} = require('./fixtures/db');

beforeEach(populateDatabase);

test('Should create portfolio for user', async () => {
    const response = await request(app)
        .post('/portfolios')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            name: 'name1'
        }).expect(201);

    const portfolio = await Portfolio.findById(response.body._id);
    expect(portfolio).not.toBeNull();
    //match names
    expect(portfolio.name).toBe('name1');
    //check if the correct user created the portfolio
    expect(portfolio.owner).toEqual(user1Id);
});

test('Should fetch portfolios for user', async () => {
    const response = await request(app)
        .get('/portfolios')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);
    //check the length of the returning array
    expect(response.body).toHaveLength(2);
});

test('Should fetch portfolios for user and sort them', async () => {
    const response = await request(app)
        .get('/portfolios?sortBy=createdAt_asc')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);
    //check the length of the returning array
    expect(response.body).toHaveLength(2);
    //check that the first portfolio you created is on the first spot of the array
    expect(JSON.stringify(response.body[0]._id)).toStrictEqual(JSON.stringify(portfolio1._id));

});

test('Should not be able to delete onothers users porfolio' , async()=>{
    const response = await request(app)
        .delete(`/portfolios/${portfolio1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(404);
    const portfolio = await Portfolio.findById(portfolio1._id);
    expect(portfolio).not.toBeNull();
});

test('Should not create a portfolio with invalid name' , async()=>{
    const response = await request(app)
        .post('/portfolios')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            "name" : ""
        }) //we send invalid name
        .expect(400);
});

test('Should not be able to rename a portfolio with invalid name' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/rename`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            "name" : ""
        }) //we send invalid name update
        .expect(400);
});

test('Should not be able to rename onother users portfolio' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/rename`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send({
            "name" : "newhehe"
        }) 
        .expect(404);
});

test('Should be able to rename his own portfolio' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/rename`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            "name" : "newhehe"
        }) 
        .expect(200);
        //check if the rename of the portfolio actually happened
        const portfolio = await Portfolio.findById(portfolio1._id);
        expect(portfolio.name).toStrictEqual("newhehe");

});

test('Should delete users portfolio', async () => {
    const response = await request(app)
    .delete(`/portfolios/${portfolio1._id}`)
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send() 
    .expect(200);

    //make sure that the user's portfolio was actually deleted from the database
    const portfolio = await Portfolio.findById(portfolio1._id);
    expect(portfolio).toBeNull();
});

test('Should not delete users portfolio if not authenticated', async () => {
    const response = await request(app)
    .delete(`/portfolios/${portfolio1._id}`)
    .send() 
    .expect(401);
});

test('Should fetch portfolios for user', async () => {
    const response = await request(app)
        .get(`/portfolios/${portfolio1._id}`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);
    //check the the portfolios match
    const portfolio = await Portfolio.findById(response.body._id);
    expect(portfolio._id).toStrictEqual(portfolio1._id);
});

test('Should not fetch portfolios for user if not authenticated', async () => {
    const response = await request(app)
        .get(`/portfolios/${portfolio1._id}`)
        .send()
        .expect(401);
});

test('Should not fetch portfolios from other users', async () => {
    const response = await request(app)
        .get(`/portfolios/${portfolio1._id}`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send()
        .expect(404);
});

test('Should be able to add coin to his own portfolio' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/add`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            "coinName" : "btc"
        }) 
        .expect(200);
        //check if the coins array is empty
        expect(response.body).toHaveLength(2);
        //also check if the correct coinName was added
        expect(response.body[1].coinId).toStrictEqual("btc");

});

test('Should not be able to add coin to other users portfolio' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/add`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send({
            "coinName" : "btc"
        }) 
        .expect(404);
});

test('Should not be able to add coin if not authenticated' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/add`)
        .send({
            "coinName" : "btc"
        }) 
        .expect(401);
});

test('Should be able to remove coin from his own portfolio' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/remove`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            "coinName" : "eth"
        }) 
        .expect(200);
        //check if the coins array is empty
        expect(response.body).toHaveLength(0);         
});

test('Should not be able to remove coin if not authenticated' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/remove`)
        .send({
            "coinName" : "btc"
        }) 
        .expect(401);
});

test('Should not be able to remove coin to other users portfolio' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/remove`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send({
            "coinName" : "btc"
        }) 
        .expect(404);
});

test('Should be able to remove all coin from his own portfolio' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/removeAll`)
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send() 
        .expect(200);
        //check if the coins array is empty
        expect(response.body).toHaveLength(0);         
});

test('Should not be able to remove all coin from other users portfolio' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/removeAll`)
        .set('Authorization', `Bearer ${user2.tokens[0].token}`)
        .send() 
        .expect(404);
});

test('Should not be able to remove all coin if not authenticated' , async()=>{
    const response = await request(app)
        .patch(`/portfolios/${portfolio1._id}/removeAll`)
        .send({
            "coinName" : "btc"
        }) 
        .expect(401);
});





