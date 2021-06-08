var express = require('express');
var router = express.Router();
const data = require('../data/states');
const auth = require('../middleware/auth');
const joi = require('joi');

//PODRÍA MODIFICARSE PARA OBTENER TODOS LOS ESTADOS
/* GET states listing. */
// api/states/
// investigar como recibir el token desde el front, y luego volver a colocar "auth"
router.get('/', auth, async function(req, res) {
  const states = await data.getAllStates();
  res.send(states);
});

//AGREGAR ESTADO

router.post('/', async (req, res) =>{
  const schemaPost = joi.object({
    description: joi.string().min(3).required(),
  })
  const result = schemaPost.validate(req.body);
  if(result.error){
    res.status(400).send(result.error.details[0].message)
  }else{
    let state = req.body;
    await data.addState(state)
    res.send(result)
  }
});

//FIND
router.get('/:id', async (req,res)=>{
  const state = await data.getState(req.params.id);
  if(state){
      res.json(state);
  } else {
      res.status(404).send('Estado no encontrado');
  }
});

//UPDATE
router.put('/:id', async (req, res) => {
  const schema = joi.object({
    description: joi.string().min(3).required(),
  });
  const result = schema.validate(req.body);
  
  if(result.error){
      res.status(400).send(result.error.details[0].message);
  } else{
      let state = req.body;
      state._id = req.params.id;      
      state = await data.updateState(state);
      res.json(state);
  }   
});

//DELETE
router.delete('/:id', async (req, res)=>{
  console.log("Body" + req.body + " params " + req.params.id)
  const state = await data.getState(req.params.id)
  if(!state){
      res.status(404).send('Estado no encontrado');
  } else {
      data.deleteState(req.params.id);
      res.status(200).send('Estado eliminado');
  }
});

module.exports = router;
