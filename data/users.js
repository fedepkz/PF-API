require("dotenv").config();
const mongodb = require("mongodb");
const connection = require("./connection");
const states = require("./states");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = "CovidAlert";
const tableUsers = "Usuarios";
const tableMeetings = "Reuniones";
const tokenPass = process.env.SECRET;
let objectId = mongodb.ObjectId;

async function getAllUsers() {
  const connectiondb = await connection.getConnection();
  const users = await connectiondb
    .db(db)
    .collection(tableUsers)
    .find()
    .toArray();
  return users;
}

async function addUser(user) {
  const connectiondb = await connection.getConnection();
  user.email = user.email.toLowerCase();
  user.password = await bcrypt.hash(user.password, 8);
  user.contactos = [];
  const result = await connectiondb
    .db(db)
    .collection(tableUsers)
    .insertOne(user);
  return result;
}

async function getUser(id) {
  const connectiondb = await connection.getConnection();
  const user = await connectiondb
    .db(db)
    .collection(tableUsers)
    .findOne({ _id: new objectId(id) });
  return user;
}

async function getMeetingsById(id) {
  const connectiondb = await connection.getConnection();
  const meetings = await connectiondb
    .db(db)
    .collection(tableMeetings)
    .find({ participants: { $elemMatch: { _id: id } } })
    .toArray();
  return meetings;
}

async function updateUser(user) {
  const clientmongo = await connection.getConnection();
  const query = { _id: new objectId(user._id) };
  console.log("EXPOTOKEN" + user.expoToken)
  let dummy = {
    name: user.name,
    lastname: user.lastname,
    email: user.email.toLowerCase(),
    contactos: user.contactos,
    state: user.state,
  }
  if (user.expoToken){
    console.log("entro al if")
    dummy.expoToken = user.expoToken
  }

  const newvalues = {
    $set: dummy
    
  };
  console.log(JSON.stringify(newvalues))

  const result = await clientmongo
    .db(db)
    .collection(tableUsers)
    .updateOne(query, newvalues);
  return result;
}

async function alertChangeStatesByUser(id) {
  const estados = await states.getAllStates();
  const user = await getUser(id);
  if (user.contactos.length > 0) {
    user.state = estados[0].description;
    changeStateByUser(user);
    user.contactos.forEach(async (contacto) => {
      const contactoActual = await getUser(contacto._id);
      if (contactoActual != null) {
        if (contactoActual.state != estados[0].description) {
          contactoActual.state = estados[2].description;
          changeStateByUser(contactoActual);
        }
      } else {
        throw new Error(
          "Este usuario ya no se encuentra en tu lista de contactos a notificar"
        );
      }
    });
  } else {
    throw new Error("Usted no posee contactos estrechos para notificar");
  }
}

async function changeStateByUser(user) {
  const clientmongo = await connection.getConnection();
  const query = { _id: new objectId(user._id) };

  const newvalues = {
    $set: {
      state: user.state,
    },
  };

  const result = await clientmongo
    .db(db)
    .collection(tableUsers)
    .updateOne(query, newvalues);
  return result;
}

async function getUserByEmail(email) {
  //agregar un if por el no encontrado
  email = email.toLowerCase();
  const connectiondb = await connection.getConnection();
  const user = await connectiondb
    .db(db)
    .collection(tableUsers)
    .findOne({ email: email });

  return user;
}

async function addContact(id, email) {
  //agregar un if por el no encontrado
  const clientmongo = await connection.getConnection();
  const nuevoContacto = await getUserByEmail(email);
  const user = await getUser(id);

  const contactos = user.contactos;
  contactos.push(nuevoContacto);
  const query = { _id: new objectId(user._id) };
  const newvalues = {
    $set: {
      email: user.email,
      password: await bcrypt.hash(user.password, 8),
      contactos: contactos,
    },
  };

  const result = await clientmongo
    .db(db)
    .collection(tableUsers)
    .updateOne(query, newvalues);
  return result;
}

async function login(email, password) {
  const connectiondb = await connection.getConnection();
  const user = await connectiondb
    .db(db)
    .collection(tableUsers)
    .findOne({ email: email });

  if (!user) {
    throw new Error("Mail o Contraseña inválido");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Mail o Contraseña inválido");
  }

  return user;
}

function generateAuthToken(user) {
  const token = jwt.sign({ _id: user._id }, tokenPass, { expiresIn: "15d" });
  return token;
}

async function deleteUser(id) {
  const clientmongo = await connection.getConnection();
  const result = await clientmongo
    .db(db)
    .collection(tableUsers)
    .deleteOne({ _id: new objectId(id) });
  return result;
}
async function generateArray(userArr) {
  var arr = userArr.map((e) => {
    return generateContact(e._id, e.fecha);
  });
  return Promise.all(arr).then((res) => {
    return res;
  });
}
async function generateContact(id, fecha) {
  var user = await getUser(id);
  var contacto = {
    _id: user._id,
    name: user.name,
    lastname: user.lastname,
    state: user.state,
    fecha: fecha,
  };
  return contacto;
}

module.exports = {
  addUser,
  getUser,
  login,
  generateAuthToken,
  addContact,
  updateUser,
  deleteUser,
  getUserByEmail,
  getAllUsers,
  getMeetingsById,
  alertChangeStatesByUser,
  generateArray,
};
