const mongodb = require('mongodb');
const connection = require('./connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function getAllUsers(){
    const connectiondb = await connection.getConnection();
    const users = await connectiondb.db('sample_betp2')
                        .collection('usuarios')
                        .find()
                        .toArray();
    return users;
}

async function addUser(user){
    const connectiondb = await connection.getConnection();

    // los nombres de base de datos pueden cambiar   
    user.password = await bcrypt.hash(user.password, 8);

    const result = await connectiondb.db('sample_betp2')
                        .collection('usuarios')
                        .insertOne(user);
    return result;
}

async function getUser(id){
    const connectiondb = await connection.getConnection();
    const user = await connectiondb.db('sample_betp2')
                        .collection('usuarios')
                        .findOne({_id: mongodb.ObjectId(id)});
    return user;
}

async function findByCredentials(email, password){
    const connectiondb = await connection.getConnection();
    const user = await connectiondb.db('sample_betp2')
                        .collection('usuarios')
                        .findOne({email: email});

    if(!user){
        throw new Error('Credenciales no validas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Credenciales no validas');
    }
    
    return user;
}

function generateAuthToken(user){
    const token = jwt.sign({_id:user._id}, 'ultrasecreta', {expiresIn: '2h'});
    return token;
}

module.exports = {addUser, getUser, findByCredentials, generateAuthToken, getAllUsers};