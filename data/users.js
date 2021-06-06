require('dotenv').config()
const mongodb = require('mongodb');
const connection = require('./connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = 'CovidAlert'
const tableUsers = 'Usuarios'
const tokenPass = process.env.SECRET;
let objectId = mongodb.ObjectId;

//PODRÍA MODIFICARSE PARA OBTENER TODOS LOS CONTACTOS DE UN USUARIO
async function getAllUsers(){
    const connectiondb = await connection.getConnection();
    const users = await connectiondb.db(db)
                        .collection(tableUsers)
                        .find()
                        .toArray();
    return users;
}

async function addUser(user){
    
    const connectiondb = await connection.getConnection();
    user.email= (user.email).toLowerCase()
    user.password = await bcrypt.hash(user.password, 8);
    user.contactos = [];
    const result = await connectiondb.db(db)
                        .collection(tableUsers)
                        .insertOne(user);
    return result;
}

async function getUser(id){
    //agregar un if por el no encontrado 
    const connectiondb = await connection.getConnection();
    const user = await connectiondb.db(db)
                        .collection(tableUsers)
                        .findOne({_id: new objectId(id)});
    return user;
}


async function updateUser(user){
    const clientmongo = await connection.getConnection();
    const query = {_id: new objectId(user._id)};

    console.log("llego")
    const newvalues = { $set:{
            email: user.email.toLowerCase(),
            contactos:user.contactos,
            state: user.state
        }
    }
        
    const result = await clientmongo.db(db)
                    .collection(tableUsers)
                    .updateOne(query, newvalues);
    return result;
}

async function getUserByEmail(email){
    //agregar un if por el no encontrado 
    email=email.toLowerCase()
    const connectiondb = await connection.getConnection();
    const user = await connectiondb.db(db)
                        .collection(tableUsers)
                        .findOne({email: email});
    return user;
}

async function addContact(id, email){   
    //agregar un if por el no encontrado 
    const clientmongo = await connection.getConnection();
    const nuevoContacto = await getUserByEmail(email);        
    const user = await getUser(id);

    const contactos = user.contactos
    contactos.push(nuevoContacto);
    const query = {_id: new objectId(user._id)};
    const newvalues = { $set:{
            email: user.email,
            password: await bcrypt.hash(user.password, 8),
            contactos: contactos
        }
    }
        
    const result = await clientmongo.db(db)
                    .collection(tableUsers)
                    .updateOne(query, newvalues);
    return result;
   
    
}

async function login(email, password){
    const connectiondb = await connection.getConnection();
    const user = await connectiondb.db(db)
                        .collection(tableUsers)
                        .findOne({email: email});

    if(!user){
        throw new Error('Mail o Contraseña inválido');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Mail o Contraseña inválido');
    }
    
    return user;
}

function generateAuthToken(user){
    const token = jwt.sign({_id:user._id}, tokenPass, {expiresIn: '15d'});
    return token;
}

async function deleteUser(id){
    const clientmongo = await connection.getConnection();
    const result = await clientmongo.db(db)
                    .collection(tableUsers)
                    .deleteOne({_id: new objectId(id)});
    return result;
}


module.exports = {addUser, getUser, login, generateAuthToken, addContact, updateUser, deleteUser, getUserByEmail, getAllUsers};