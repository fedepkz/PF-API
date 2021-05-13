const express = require('express');
const router = express.Router();
const dataInventor = require('../data/inventor');

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
    //TODO: Validacion
    let inventor = req.body;
    inventor = await dataInventor.addInventor(inventor);
    res.json(inventor);
});

router.put('/:id', async (req, res)=>{
    //TODO: validacion
    let inventor = req.body;
    inventor._id = req.params.id;
    dataInventor.updateInventor(inventor);
    res.json(inventor);
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
