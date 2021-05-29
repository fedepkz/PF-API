const mongoclient = require('mongodb').MongoClient;
// TODO utilizar varibales de entorno
//const uri = "mongodb+srv://admin:admin123@cluster0.zaghe.mongodb.net/sample_tp2?retryWrites=true&w=majority";

const uri = "mongodb+srv://admin:admin123@cluster0.dms7r.mongodb.net/CovidAlert?retryWrites=true&w=majority";

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





