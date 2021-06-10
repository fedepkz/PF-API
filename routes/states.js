var express = require('express');
var router = express.Router();
const data = require('../data/states');
const auth = require('../middleware/auth');
const joi = require('joi');


/**
 * @swagger
 * components:
 *  schemas:
 *    State:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the state
 *        description:
 *          type: string
 *          description: The state description        
 */


/**
 * @swagger
 * tags:
 *    name: States
 *    description: The Covid Alert managing states API  
 */

/**
 * @swagger
 * /api/states:
 *  get:
 *    summary: Get all states
 *    tags: [States]
 *    responses:
 *      200:
 *        description: A list of states.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/State'
 */
router.get('/', auth, async function(req, res) {
  const states = await data.getAllStates();
  res.send(states);
});

/**
 * @swagger
 * /api/states/{id}:
 *  get:
 *    summary: Get state by id
 *    tags: [States]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The state id
 *    responses:
 *      200:
 *        description: The state description by id
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/State'
 *      404:
 *        description: The state was not found
 */
router.get('/:id', auth, async (req,res)=>{
  const state = await data.getState(req.params.id);
  if(state){
      res.json(state);
  } else {
      res.status(404).send('Estado no encontrado');
  }
});


/**
 * @swagger
  * /api/states:
  *   post:
  *     summary: Create a new state
  *     tags: [States]
  *     requestBody:
  *       required: true
  *       content:
  *        application/json:
  *           schema:
  *             $ref: '#/components/schemas/State'
  *     responses:
  *       200:
  *         description: The state was successfully created
  *         content:
  *          application/json:
  *             schema:
  *               $ref: '#/components/schemas/State'
  *       400:
  *         description: You need permissions
 */
router.post('/', auth, async (req, res) =>{
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


/**
 * @swagger
 * /api/states/{id}:
 *  put:
 *    summary: Update the state by id
 *    tags: [States]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The state id
 *    requestBody:
 *       required: true  
 *       content:
 *        application/json:
 *           schema: 
 *            $ref: '#/components/schemas/State'
 *    responses:
 *      200:
 *        description: The state was updated
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/State'
 *      404:
 *        description: The state was not found
 */
router.put('/:id', auth, async (req, res) => {
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

/**
 * @swagger
 * /api/states/{id}:
 *  delete:
 *    summary: remove the state by id
 *    tags: [States]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The state id
 *    responses:
 *      200:
 *        description: The state was deleted
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/State'
 *      404:
 *        description: The state was not found
 */
router.delete('/:id', auth, async (req, res)=>{
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
