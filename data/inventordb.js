const connection = require('./connection');
let objectId = require('mongodb').ObjectId;

async function getInventors(){
    const clientmongo = await connection.getConnection();
   console.log(clientmongo);
    const inventors = await clientmongo.db('sample_tp2')
                    .collection('inventors')
                    .find()
                    .toArray();
    return inventors;
}

async function getInventor(id){
    const clientmongo = await connection.getConnection();
    const inventor = await clientmongo.db('sample_tp2')
                    .collection('inventors')
                    .findOne({_id: new objectId(id)});
    return inventor;
}

async function addInventor(inventor){
    const clientmongo = await connection.getConnection();
    const result = await clientmongo.db('sample_tp2')
                    .collection('inventors')
                    .insertOne(inventor);
    return result;
}

async function updateInventor(inventor){
    const clientmongo = await connection.getConnection();
    const query = {_id: new objectId(inventor._id)};
    const newvalues = { $set:{
            first: inventor.first,
            last: inventor.last,
            year: inventor.year
        }
    };

    const result = await clientmongo.db('sample_tp2')
                    .collection('inventors')
                    .updateOne(query, newvalues);
    return result;
}

async function deleteInventor(id){
    const clientmongo = await connection.getConnection();
    const result = await clientmongo.db('sample_tp2')
                    .collection('inventors')
                    .deleteOne({_id: new objectId(id)});
    return result;
}

module.exports = {getInventors, getInventor, addInventor, updateInventor, deleteInventor};