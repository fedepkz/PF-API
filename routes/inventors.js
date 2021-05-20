const express = require('express');
const router = express.Router();
const dataInventor = require('../data/inventordb');
const joi = require('joi');

// /api/inventors/
router.get('/', async function(req, res, next) {
    let inventors = await dataInventor.getInventors();    
    res.json(inventors);
});

router.get('/:id', async (req,res)=>{
    const inventor = await dataInventor.getInventor(req.params.id);
    if(inventor){
        res.json(inventor);
    } else {
        res.status(404).send('Inventor no encontrado');
    }
});

router.post('/', async (req, res)=>{    
    const schema = joi.object({
        first: joi.string().alphanum().min(3).required(),
        last: joi.string().alphanum().min(3).required(),
        year: joi.number().min(1900).max(2020).required()
    });
    const result = schema.validate(req.body);
    console.log(result);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
    } else{
        let inventor = req.body;
        inventor = await dataInventor.addInventor(inventor);
        res.json(inventor);
    }    
});

router.put('/:id', async (req, res)=>{    
    const schema = joi.object({
        first: joi.string().alphanum().min(3),
        last: joi.string().alphanum().min(3),
        year: joi.number().min(1400).max(2020)
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
    } else{
        let inventor = req.body;
        inventor._id = req.params.id;
        dataInventor.updateInventor(inventor);
        res.json(inventor);
    }
});

router.delete('/:id', async (req, res)=>{
    const inventor = await dataInventor.getInventor(req.params.id)
    if(!inventor){
        res.status(404).send('Iventor no encontrado');
    } else {
        dataInventor.deleteInventor(req.params.id);
        res.status(200).send('Inventor eliminado');
    }
});


module.exports = router;
