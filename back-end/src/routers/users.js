const express = require('express');
const mongoose = require('mongoose');
const User = require("../db/schemas/User");
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const sharp = require('sharp');
const { sendWelcomeEmail , sendCancelationEmail } = require('../emails/account');
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 1000000 //1mb
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('The type of file you are trying to upload is not supported.Type of files supported : png,jpg,jpeg'));
        }
        cb(undefined, true);
    }
});
const router = new express.Router();

//users profile
router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user);
});

//upload profile picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //convert image to the png format and resize it
    const buffer = await sharp(req.file.buffer).resize({ width:250,height:250 }).png().toBuffer();
    req.user.avatar = buffer;
    req.user.save();
    res.status(200).send();
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    });
});

//serve profile picture
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await  User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        //set headers to send an image back
        res.set('Content-Type', 'image/png')
        res.status(200).send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

//delete profile picture
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    req.user.save();
    res.status(200).send();
});

//sign up a user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email , user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({
            // user,
            token
        });
    } catch (e) {
        // res.status(400).send(e);
        res.status(400).json({code:400, msg:e.message});
    }

});

//login a user 
router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({
            // user,
            token
        });
    } catch (e) {
        // res.status(400).send(e.message);
        res.status(400).json({code:400, msg:e.message});
    }
});

//logout a user
router.post('/users/logout', auth, async (req, res) => {

    try {
        //delete a specific token - from the session user wants to log out
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();

        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});

//delete all tokens - logout from all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});

//customize user's profile
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates!'
        });
    }

    try {

        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save()
        res.status(200).send(req.user);

    } catch (e) {
        //Bad request
        res.status(400).send(e);
    }
});

//delete a users profile
router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove();
        sendCancelationEmail(req.user.email , req.user.name);
        res.status(200).send(req.user);

    } catch (e) {
        //Bad request
        res.status(400).send(e);
    }
});

module.exports = router