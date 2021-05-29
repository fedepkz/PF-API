const jwt = require('jsonwebtoken');


function auth(req, res, next){
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        userId = jwt.verify(token, 'vidCod');            
        next();
    } catch (error) {
       res.status(401).send({error: error.message});
    }
}

module.exports = auth;