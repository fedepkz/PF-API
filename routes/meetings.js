var express = require('express');
var router = express.Router();
const data = require('../data/meetings');
const auth = require('../middleware/auth');
const joi = require('joi');

//PODRÍA MODIFICARSE PARA OBTENER TODAS LAS REUNIONES DE UN USUARIO
/* GET meetings listing. */
// api/meetings/
// investigar como recibir el token desde el front, y luego volver a colocar "auth"
router.get('/', auth, async function(req, res, next) {
  const meetings = await data.getAllmeetings();
  res.send(meetings);
});


// api/meetings/
//AGREGAR MEETING
// router.get('/', async (req, resp) =>{
//     // const result = funcion que devuelve todos los contactos del usuario
//     // res.send(result);
// });
router.post('/', async (req, res) =>{
  const schemaPost = joi.object({
    name: joi.string().alphanum().min(3).required(),
    fecha: joi.date().required(),
    place: joi.string().min(3).required(),
    participants: joi.required()
  })
  console.log(schemaPost);
  const result = schemaPost.validate(req.body);
  console.log(result);
  if(result.error){
    res.status(400).send(result.error.details[0].message)
  }else{
    let meeting = req.body;
    await data.addMeeting(meeting)
    res.send(result)
  }
});

//FIND
router.get('/:id', async (req,res)=>{
  const meeting = await data.getMeeting(req.params.id);
  if(meeting){
      res.json(meeting);
  } else {
      res.status(404).send('Reunion no encontrada');
  }
});

//AGREGAR CONTACTO A LA REUNION
router.post('/:id/addContact', auth, async (req, res) => { 
  const result = await data.addContact(req.params.id, req.body.email);
  res.send(result);
});

//UPDATE
router.post('/:id', auth, async (req, res) => {
  //validaciones, a mejorar, agregar en addmeeting
  const schema = joi.object({
    fecha: joi.string().alphanum().min(3).required(),
    // password: joi.string().alphanum().min(3).required(),
    //year: joi.number().min(1900).max(2020).required()
  });
  const result = schema.validate(req.body);
  
  if(result.error){
      res.status(400).send(result.error.details[0].message);
  } else{
      let meeting = req.body;
      meeting._id = req.params.id;      
      meeting = await data.updateMeeting(meeting);
      res.json(meeting);
  }   
});
//DELETE
router.delete('/:id', async (req, res)=>{
  const meeting = await data.getMeeting(req.params.id)
  if(!meeting){
      res.status(404).send('Reunion no encontrada');
  } else {
      data.deleteMeeting(req.params.id);
      res.status(200).send('Reunion eliminada');
  }
});

module.exports = router;
