require('dotenv').config()
const mongoclient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI
const client = new mongoclient(uri, {useUnifiedTopology: true});
let instance = null;

async function getConnection(){
    if(instance == null){
        try {
            instance = await client.connect();
            // console.log(instance)
        } catch (err) {
            console.log(err.message);
            throw new Error('problemas al conectarse con mongo');
        }
    }
    return instance;
}

module.exports = {getConnection};





