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

// @route   GET p-tracker-api/users/me
// @desc    Get users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    res.status(200).send(req.user);
});

// @route   POST p-tracker-api/users/me/avatar
// @desc    Upload user image
// @access  Private
router.post('/me/avatar', auth, upload.single('avatar'), async (req, res) => {
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

// @route   GET p-tracker-api/users/:id/avatar
// @desc    Serve some user's image
// @access  Public
router.get('/:id/avatar', async (req, res) => {
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

// @route   DELETE p-tracker-api/users/me/avatar
// @desc    Delete user's image
// @access  Private
router.delete('/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    req.user.save();
    res.status(200).send();
});

// @route   POST p-tracker-api/users
// @desc    Signup a user
// @access  Public
router.post('/', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email , user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({
            user,
            token
        });
    } catch (e) {
        res.status(400).send({ error: e });
    }

});

// @route   POST p-tracker-api/users/login
// @desc    Login a user
// @access  Public 
router.post('/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({
            user,
            token
        });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

// @route   POST p-tracker-api/users/logout
// @desc    Logout a user
// @access  Private
router.post('/logout', auth, async (req, res) => {

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

// @route   POST p-tracker-api/users/logoutAll
// @desc    Logout a user from all sessions
// @access  Private
router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});

// @route   PATCH p-tracker-api/users/me
// @desc    Customize user's profile
// @access  Private
router.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);    
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates'
        });
    }

    try {
        //check if password is provided
        const includesPass = updates.includes("password")
        if(includesPass){
            const current = req.body.password.current
            const updated = req.body.password.updated
            if(updated && current){
                // check if email exists and 'current' given matches - if not, the error will be caught
                const user = await User.findByCredentials(req.user.email, current)
                req.body.password = updated
            }
            else{
                res.status(400).send({
                    error: 'Provide current and new password correctly'
                })
            }
        }

        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save()
        res.status(200).send(req.user);
    } catch (e) {
        //Bad request
        res.status(400).send({error:e.message});
    }
});

// @route   DELETE p-tracker-api/users/me
// @desc    Delete user
// @access  Private
router.delete('/me', auth, async (req, res) => {
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