const user = require("./users");

function mergeContacts(contacts, date) {
  const centinela = { _id: "0000" };
  const arr = contacts;
  contacts.push(centinela);
  var cabecera = contacts.shift();
  while (cabecera._id != centinela._id) {
    actualizarContactos(cabecera, arr, date);
    contacts.push(cabecera);
    cabecera = contacts.shift();
  }
}

async function actualizarContactos(usuario, arrMeeting, date) {
  var index = -2;
  var contacto;
  var usuarioAct = await user.getUser(usuario._id);
  for (let i = 0; i < arrMeeting.length; i++) {
    contacto = arrMeeting[i];
    index = usuarioAct.contactos.findIndex((e) => contacto._id === e._id);
    if (usuarioAct._id != arrMeeting[i]._id) {
      if (index == -1) {
        contacto = Object.assign(contacto, { fecha: date });
        usuarioAct.contactos.push(contacto);
      } else {
        usuarioAct.contactos[index].fecha = date;
      }
    }
  }
  let result = await user.updateUser(usuarioAct);
}

module.exports = { mergeContacts };
