var express = require("express");
var router = express.Router();
const data = require("../data/meetings");
const auth = require("../middleware/auth");
const joi = require("joi");
const merge = require("../data/merge");
const { generateArray } = require("../data/users");

/**
 * @swagger
 * components:
 *  schemas:
 *    Meeting:
 *      type: object
 *      required:
 *        - name
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the meeting
 *        name:
 *          type: string
 *          description: The meeting name
 *        place:
 *          type: string
 *          description: The meeting place name
 *        participants:
 *          type: object
 *          description: The meeting participants
 *        date:
 *          type: string
 *          description: The meeting date
 */

/**
 * @swagger
 * tags:
 *    name: Meetings
 *    description: The Covid Alert managing Meetings API
 */

/**
 * @swagger
 * /api/meetings:
 *  get:
 *    summary: Get all meetings
 *    tags: [Meetings]
 *    responses:
 *      200:
 *        description: A list of meetings.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Meeting'
 */
router.get("/", auth, async function (req, res, next) {
  const meetings = await data.getAllmeetings();
  res.send(meetings);
});

/**
 * @swagger
 * /api/meetings/{id}:
 *  get:
 *    summary: Get meeting by id
 *    tags: [Meetings]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The meeting id
 *    responses:
 *      200:
 *        description: The meeting description by id
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Meeting'
 *      404:
 *        description: The meeting was not found
 */
router.get("/:id", auth, async (req, res) => {
  const meeting = await data.getMeeting(req.params.id);
  if (meeting) {
    res.json(meeting);
  } else {
    res.status(404).send("Reunion no encontrada");
  }
});

router.get("/:id/participants", auth, async (req, res) => {
  const meeting = await data.getMeeting(req.params.id);
  if (meeting) {
    const participants = await data.generateArray(meeting.participants);
    res.json(participants);
  } else {
    res.status(404).send("Reunion no encontrada");
  }
});

/**
 * @swagger
  * /api/meetings:
  *   post:
  *     summary: Create a new meeting
  *     tags: [Meetings]
  *     requestBody:
  *       required: true
  *       content:
  *        application/json:
  *           schema:
  *             $ref: '#/components/schemas/Meeting'
  *     responses:
  *       200:
  *         description: The meeting was successfully created
  *         content:
  *          application/json:
  *             schema:
  *               $ref: '#/components/schemas/Meeting'
  *       400:
  *         description: You need permissions
 */
router.post("/", auth, async (req, res) => {
  const schemaPost = joi.object({
    _hostId: joi.required(),
    name: joi.string().required().min(3).max(50).regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
    date: joi.date().required(),
    place: joi.string().required().min(3).max(50).regex(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/),
    participants: joi.required(),
  });
  console.log(req.body);
  const result = schemaPost.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    console.log(result.error)
  } else {
    let meeting = req.body;
    await data.addMeeting(meeting);
    res.send(result);
    merge.mergeContacts(meeting.participants, meeting.date);
  }
});

/**
 * @swagger
 * /api/meetings/{id}:
 *  put:
 *    summary: Update the meeting by id
 *    tags: [Meetings]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The meeting id
 *    requestBody:
 *       required: true
 *       content:
 *        application/json:
 *           schema:
 *            $ref: '#/components/schemas/Meeting'
 *    responses:
 *      200:
 *        description: The meeting was updated
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Meeting'
 *      404:
 *        description: The meeting was not found
 */
router.put("/:id", auth, async (req, res) => {
  const schema = joi.object({
    name: joi.string().alphanum().min(3).required(),
    date: joi.date().required(),
    place: joi.string().min(3).required(),
  });
  const result = schema.validate(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
  } else {
    let meeting = req.body;
    meeting._id = req.params.id;
    meeting = await data.updateMeeting(meeting);
    res.json(meeting);
  }
});

/**
 * @swagger
 * /api/meetings/{id}:
 *  delete:
 *    summary: remove the meeting by id
 *    tags: [Meetings]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The meeting id
 *    responses:
 *      200:
 *        description: The meeting was deleted
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Meeting'
 *      404:
 *        description: The meeting was not found
 */
router.delete("/:id", auth, async (req, res) => {
  const meeting = await data.getMeeting(req.params.id);
  if (!meeting) {
    res.status(404).send("Reunion no encontrada");
  } else {
    data.deleteMeeting(req.params.id);
    res.status(200).send("Reunion eliminada");
  }
});

module.exports = router;
