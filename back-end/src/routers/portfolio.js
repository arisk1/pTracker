const express = require('express');
const mongoose = require('mongoose');
const Portfolio = require("../db/schemas/Portfolio");
const auth = require('../middleware/auth');
const router = new express.Router();


// @route   POST p-tracker-api/portfolios
// @desc    Add new portfolio?
// @access  Private
router.post('/', auth ,async (req, res) => {
    
    const portfolio = new Portfolio({
        ...req.body, //ES6 way to store all fieds of req.body 
        owner : req.user._id
    })
    try{
        await portfolio.save();
        res.status(201).send(portfolio);
    }catch(e){
        res.status(400).send(e);
    }
});

// @route   GET p-tracker-api/portfolios
// @desc    Get user's portfolios - expected: GET /portfolios?sortBy=createdAt_asc
// @access  Private
router.get('/',auth ,async (req, res) => {
    const sort = {};
    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try{
        //alternative way to fetch users 
        // const portfolios = await Portfolio.find({ owner : req.user._id});
        
        await req.user.populate({
            path : 'portfolios',
            options : {
                sort //1 ascending | -1 descending
            }
        }).execPopulate();
        res.status(200).send(req.user.portfolios);
        
    }catch(e){
        res.status(500).send(e);
    }
});

// @route   GET p-tracker-api/portfolios/:id
// @desc    Get a specific user's portfolio
// @access  Private
router.get('/:id', auth ,async (req, res) => {
    const _id = req.params.id;

    try{
        //make sure the user is trying to fetch his own portfolio 
        const portfolio = await Portfolio.findOne({ _id , owner : req.user._id});
        if (!portfolio) {
            return res.status(404).send();
        }
        res.status(200).send(portfolio);
    }catch(e){
        if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            //handle the invalid IDs
            return res.status(400).send();
        }
        //handle the internal server error
        res.status(500).send(e);
    }
});

// @route   DELETE p-tracker-api/portfolios/:id
// @desc    Delete a specific user's portfolio
// @access  Private
router.delete('/:id',auth , async (req,res)=> {
    try {
        const portfolio = await Portfolio.findOneAndDelete({_id : req.params.id , owner : req.user._id});
        if (!portfolio) {
            return res.status(404).send();
        }
        res.status(200).send(portfolio);

    } catch(e) {
        //Bad request
        res.status(400).send(e);
    }
});

// @route   PATCH p-tracker-api/portfolios/:id/rename
// @desc    Rename a user's portfolio
// @access  Private
router.patch('/:id/rename',auth , async (req,res)=> {
    if(!req.body.name){
        return res.status(400).send({error : 'Invalid updates!'});
    }
    try {
        const portfolio = await Portfolio.findOne({_id : req.params.id , owner : req.user._id});
       
        if (!portfolio) {
            return res.status(404).send();
        }
        portfolio.name = req.body.name;
        await portfolio.save();

        res.status(200).send(portfolio);

    } catch(e) {
        //Bad request
        res.status(400).send(e);
    }
});

// @route   PATCH p-tracker-api/portfolios/:id/add
// @desc    Add coins to user's portfolio
// @access  Private
router.patch('/:id/add',auth , async (req,res)=> {
    if(!req.body.coinName){
        return res.status(400).send({error : 'Invalid updates!'});
    }
    try {
        const portfolio = await Portfolio.findOne({_id : req.params.id , owner : req.user._id});
       
        if (!portfolio) {
            return res.status(404).send();
        }
        const coins = await portfolio.addCoin(req.body.coinName)
        res.status(200).send(coins);

    } catch(e) {
        //Bad request
        res.status(400).send(e);
    }
});

// @route   PATCH p-tracker-api/portfolios/:id/remove
// @desc    Remove coins from user's portfolio
// @access  Private
router.patch('/:id/remove',auth , async (req,res)=> {
    if(!req.body.coinName){
        return res.status(400).send({error : 'Invalid updates!'});
    }
    try {
        const portfolio = await Portfolio.findOne({_id : req.params.id , owner : req.user._id});
       
        if (!portfolio) {
            return res.status(404).send();
        }
        const remainingCoins = await portfolio.removeCoin(req.body.coinName)
        res.status(200).send(remainingCoins);

    } catch(e) {
        //Bad request
        res.status(400).send(e);
    }
});

// @route   PATCH p-tracker-api/portfolios/:id/removeAll
// @desc    Remove all coins from user's portfolio
// @access  Private
router.patch('/:id/removeAll',auth , async (req,res)=> {
    try {
        const portfolio = await Portfolio.findOne({_id : req.params.id , owner : req.user._id});
       
        if (!portfolio) {
            return res.status(404).send();
        }
        portfolio.coins = [];
        await portfolio.save();
        res.status(200).send(portfolio.coins);

    } catch(e) {
        //Bad request
        res.status(400).send(e);
    }
});



module.exports = router
