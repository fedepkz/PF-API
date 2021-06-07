const mongodb = require('mongodb');
const connection = require('./connection');
const data = require('./users');
const db = 'CovidAlert'
const tableMeetings = 'Reuniones'
let objectId = mongodb.ObjectId;

//PODRÍA MODIFICARSE PARA OBTENER TODOS LOS CONTACTOS DE UN USUARIO
async function getAllmeetings(){
    const connectiondb = await connection.getConnection();
    const meetings = await connectiondb.db(db)
                        .collection(tableMeetings)
                        .find()
                        .toArray();
    return meetings;
}

async function addMeeting(meeting){  
    const connectiondb = await connection.getConnection();
    const result = await connectiondb.db(db)
                        .collection(tableMeetings)
                        .insertOne(meeting);
    return result;
}

async function getMeeting(id){
    //agregar un if por el no encontrado 
    const connectiondb = await connection.getConnection();
    const meeting = await connectiondb.db(db)
                        .collection(tableMeetings)
                        .findOne({_id: new objectId(id)}); 
    if(meeting==null){
        throw new Error('Reunion no encontrada');
    }

    return meeting;

}


async function updateMeeting(meeting){
    const clientmongo = await connection.getConnection();
    const query = {_id: new objectId(meeting._id)};
    const newvalues = { $set:{
            fecha: meeting.fecha, 
            members: meeting.members           
        }
    }       
    const result = await clientmongo.db(db)
                    .collection(tableMeetings)
                    .updateOne(query, newvalues);
    return result;
}
//SE PUEDE CAMBIAR A FIND ALL SI HACE FALTA LA FUNCION
// async function getMeetingByFecha(fecha){
//     //agregar un if por el no encontrado 
//     const connectiondb = await connection.getConnection();
//     const meeting = await connectiondb.db(db)
//                         .collection(tableMeetings)
//                         .findOne({fecha: fecha});
//     return meeting._id;
// }

async function addContact(id, email){   
    //agregar un if por el no encontrado
    const clientmongo = await connection.getConnection(); 
    const nuevoContacto = await data.getUserByEmail(email);    
    const meeting = await getMeeting(id);
    
    
    const members = meeting.members;
    if(nuevoContacto==null){
        nuevoContacto.Error;
    }else{
        members.push(nuevoContacto);
    }

    console.log(members);
    const query = {_id: new objectId(meeting._id)};
    const newvalues = { $set:{
            fecha: meeting.fecha, 
            members: members          
        }
    }
        
    const result = await clientmongo.db(db)
                    .collection(tableMeetings)
                    .updateOne(query, newvalues);
    return result;    
}



async function deleteMeeting(id){
    const clientmongo = await connection.getConnection();
    const result = await clientmongo.db(db)
                    .collection(tableMeetings)
                    .deleteOne({_id: new objectId(id)});
    return result;
}


module.exports = {addMeeting, getMeeting, addContact, updateMeeting, deleteMeeting, getAllmeetings};