const request = require('supertest');
const app = require('../src/app');
const User = require('../src/db/schemas/User');
const {user1Id , user1 , populateDatabase} = require('./fixtures/db');

beforeEach(populateDatabase);

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: "testAris",
        email: "testaris@example.com",
        password: "HeHepassw!99"
    }).expect(201);

    //Assert that the databse was changed cirrectly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: "testAris",
            email: "testaris@example.com"
        },
        token: user.tokens[0].token
    })

    //Expect password not to be plain text
    expect(user.password).not.toBe('HeHepassw!99');
});

test('Should login an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: user1.email,
        password: user1.password
    }).expect(200);

    //make sure the token is saved 
    const user = await User.findById(response.body.user._id);
    expect(response.body).toMatchObject({
        token: user.tokens[1].token
    })
});

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: "wrongusername",
        password: "WhAtEVeR123!"
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Should not get profile for non authenitcated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401); //error code when we do not provide authorization token
});

test('Should delete users profile', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);

    //make sure that the user was actually deleted from the database
    const user = await User.findById(user1Id);
    expect(user).toBeNull();
});

test('Should not be able to delete user,not authenticated', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401); //error code when we do not provide authorization token
});

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    //check tha binary data was saved
    const user = await User.findById(user1Id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            name: 'testdummyname',
            email: "dummy@email.com"
        }).expect(200);

    //check tha the users fields actually changed
    const user = await User.findById(user1Id);
    expect(user).toMatchObject({
        name: 'testdummyname',
        email: "dummy@email.com"
    });
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            location: 'testdummyname',
            idontkknowfield: "dummy@email.com"
        }).expect(400);
})