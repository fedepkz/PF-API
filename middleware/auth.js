require('dotenv').config()
const jwt = require('jsonwebtoken');
const secret= process.env.SECRET;

function auth(req, res, next){
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        userId = jwt.verify(token, secret);            
        next();
    } catch (error) {
       res.status(401).send({error: error.message});
    }
}

module.exports = auth;