const jwt = require('jsonwebtoken');
const User = require('../db/schemas/User');

const auth = async (req,res,next) => {
    try{
        //get token from client
        const token = req.header('Authorization').replace('Bearer ','');
        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({_id : decoded._id, 'tokens.token': token});

        if(!user){
            //trigger catch
            throw new Error();
        }

        //pass user , token to req
        req.token = token;
        req.user = user;
        next();
    }catch(e){
        res.status(401).send({error : 'Plase authenticate!'});
    }

}

module.exports = auth;