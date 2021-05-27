const jwt = require('jsonwebtoken');

function auth(req, res, next){
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        
        const user = jwt.verify(token, 'ultrasecreta');  
        console.log(user);      
        next();
    } catch (error) {
       res.status(401).send({error: error.message});
    }
}

module.exports = auth;