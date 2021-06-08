const mongodb = require('mongodb');
const connection = require('./connection');
const data = require('./users');
const db = 'CovidAlert'
const tableStates = 'Estados'
let objectId = mongodb.ObjectId;

async function getAllStates(){
    const connectiondb = await connection.getConnection();
    const states = await connectiondb.db(db)
                        .collection(tableStates)
                        .find()
                        .toArray();
    return states;
}

async function addState(state){  
    const connectiondb = await connection.getConnection();
    const result = await connectiondb.db(db)
                        .collection(tableStates)
                        .insertOne(state);
    return result;
}

async function getState(id){
    const connectiondb = await connection.getConnection();
    const state = await connectiondb.db(db)
                        .collection(tableStates)
                        .findOne({_id: new objectId(id)}); 
    return state;
}

async function updateState(state){
    const clientmongo = await connection.getConnection();
    const query = {_id: new objectId(state._id)};
    const newvalues = { $set:{
            descripcion: state.descripcion      
        }
    }       
    const result = await clientmongo.db(db)
                    .collection(tableStates)
                    .updateOne(query, newvalues);
    return result;
}

async function deleteState(id){
    const clientmongo = await connection.getConnection();
    const result = await clientmongo.db(db)
                    .collection(tableStates)
                    .deleteOne({_id: new objectId(id)});
    return result;
}


module.exports = {getAllStates, addState, getState, updateState, deleteState};