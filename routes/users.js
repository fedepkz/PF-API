var express = require("express");
var router = express.Router();
const data = require("../data/users");
const auth = require("../middleware/auth");
const joi = require("joi");
const { required } = require("joi");

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the user
 *        firstname:
 *          type: string
 *          description: The user firstname
 *        lastname:
 *          type: string
 *          description: The user lastname
 *        date:
 *          type: string
 *          description: The user birth date
 *        email:
 *          type: string
 *          description: The user email
 *        password:
 *          type: string
 *          description: The user password
 *        state:
 *          type: string
 *          description: The user Health State            
 */


/**
 * @swagger
 * tags:
 *    name: Users
 *    description: The Covid Alert managing Users API  
 */

/**
 * @swagger
 * /api/users:
 *  get:
 *    summary: Get all users
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: A list of users.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */
router.get("/", auth, async function (req, res, next) {
  const users = await data.getAllUsers();
  res.send(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *    summary: Get user by id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    responses:
 *      200:
 *        description: The user description by id
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await data.getUser(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.log(error);
  }
});

/**
 * @swagger
  * /api/users:
  *   post:
  *     summary: Create a new user
  *     tags: [Users]
  *     requestBody:
  *       required: true
  *       content:
  *        application/json:
  *           schema:
  *             $ref: '#/components/schemas/User'
  *     responses:
  *       200:
  *         description: The user was successfully created
  *         content:
  *          application/json:
  *             schema:
  *               $ref: '#/components/schemas/User'
  *       400:
  *         description: You need permissions
 */
router.post("/", async (req, res) => {
  const schemaPost = joi.object({
    name: joi.string().pattern(new RegExp("^[a-zA-Z]{3,30}$")).required(),
    lastname: joi.string().pattern(new RegExp("^[a-zA-Z]{3,30}$")).required(),
    date: joi.date().max("now").required(),
    email: joi.string().email({ minDomainSegments: 2, tlds: true }).required(),
    password: joi.string().alphanum().min(6).required(),
    state: joi.required(),
  });
  const result = schemaPost.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else if (!(await data.getUserByEmail(req.body.email))) {
    let user = req.body;
    await data.addUser(user);
    res.send(result);
  } else {
    let error = new Error("el email ya se encuentra registrado");
    res.status(400).send(error.message);
  }
});

/**
 * @swagger
 * /api/users/meetings/{id}:
 *  get:
 *    summary: Get all meetings by id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    responses:
 *      200:
 *        description: The meetings by user id
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Meeting'
 *      404:
 *        description: The meetings was not found
 */
router.get("/meetings/:id", auth, async (req, res) => {
  try {
    const meetings = await data.getMeetingsById(req.params.id);
    res.json(meetings)
  } catch (error) {
    console.log(error);
  }
});

/**
 * @swagger
  * /api/users/login:
  *   post:
  *     summary: Login 
  *     tags: [Users]
  *     requestBody:
  *       required: true
  *       content:
  *        application/json:
  *           schema:
  *             type: object
  *             properties:
  *               email:
  *                 type: string
  *               name:
  *                 type: string
  *     responses:
  *       200:
  *         description: Access Granted
  *         content:
  *          application/json:
  *             schema:
  *               $ref: '#/components/schemas/User'
  *       401:
  *         description: Account or Password missmatch
 */
router.post("/login", async (req, res) => {
  try {
    let email = req.body.email.toLowerCase();
    const user = await data.login(email, req.body.password);
    const token = data.generateAuthToken(user);
    console.log(email + " "+ user +" "+ token)
    console.log(token);
    res.send({ user, token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

// //AGREGAR CONTACTO
// router.post("/:id/addContact", auth, async (req, res) => {
//   const result = await data.addContact(req.params.id, req.body.email);
//   res.send(result);
// });


/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *    summary: Update the user by id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *       required: true  
 *       content:
 *        application/json:
 *           schema: 
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The user was updated
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 */
router.put("/:id", auth, async (req, res) => {

  const schemaUpdate = joi.object({
    
    name: joi.string().pattern(new RegExp("^[a-zA-Z]{3,30}$")).required(),
    lastname: joi.string().pattern(new RegExp("^[a-zA-Z]{3,30}$")).required(),
    email:joi.string().email({ minDomainSegments: 2, tlds: true }).required(),
    password: joi.required(),
    state:joi.required(),
    contactos:joi.required()
  });
  console.log( req.body)
  const result = schemaUpdate.validate(req.body);
  
  if (result.error) { 
    console.log(result.error)   
    res.status(400).send(result.error.details[0].message);
  } else {
    let user = req.body;  
    user._id = req.params.id
    response = await data.updateUser(user);
    res.json(response);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *    summary: remove the user by id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    responses:
 *      200:
 *        description: The user was deleted
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 */
router.delete("/:id", auth, async (req, res) => {
  const user = await data.getUser(req.params.id);
  if (!user) {
    res.status(404).send("Usuario no encontrado");
  } else {
    data.deleteUser(req.params.id);
    res.status(200).send("Usuario eliminado");
  }
});

/**
 * @swagger
 * /api/users/alertbyuser/{id}:
 *  put:
 *    summary: Update the user and contact list state by user id 
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *       required: false  
 *       content:
 *        application/json:
 *           schema: 
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: The user state was updated
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 */
router.put("/alertbyuser/:id", auth, async (req, res) => {
  try {
    response = data.alertChangeStatesByUser(req.params.id);   
    res.json(response);
  } catch (error) {
    console.log(error)
  }
});




module.exports = router;
