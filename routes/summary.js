const express = require('express');
const router = express.Router();
const getNewDescription = require('../functions/getNewDescription');
const Summary = require('../models/summary');

router.post('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const { name, email, comment } = req.body;
    const data = await Summary.findByIdAndUpdate(id, {
        $push: { comments: [{name, email, comment }]}
      }, { new: true, upsert: true}); 
    res.redirect(`/summary/${id}`);  
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const data = await Summary.findById(id);
    res.render('summary/show', { data });
});

router.get('/tags/:tag', async (req, res) => {
    const { tag } = req.params;
    const data = await Summary.find({ tags: tag });
    for(let i = 0; i < data.length; i++){
        let newStr = getNewDescription(data[i].description);
        data[i].description = newStr;
    }
    res.render('summary/tag', { data , tag });
})

router.get('/', async (req, res) => {
    const data = await Summary.find({});
    /* Since it's a get request i'm making the 
    description in database should not change 
    */ 
    for(let i = 0; i < data.length; i++){
        let newStr = getNewDescription(data[i].description);
        data[i].description = newStr;
    }
    res.render('summary/index', { data });
});

module.exports = router;