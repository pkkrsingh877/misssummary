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
    let { page, skip, limit } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    skip = parseInt(skip);
    if(!page || page < 0 ){
        page = 1;
    }
    if(!skip || skip < 0){
        skip = 4;
    }
    if(!limit || limit < 0){
        limit = 4;
    }
    const currentPage = parseInt(page);
    let temp = currentPage;
    if(temp != 1){
        temp--;
    }
    const count = await Summary.find({ tags: tag}).countDocuments();
    const totalPages = Math.ceil(count/limit);
    if(page > totalPages){
        temp = totalPages - 1;
        page = totalPages;
    }
    const data = await Summary.find({ tags: tag }).skip((page - 1) * skip).limit(limit).sort({"createdAt": -1});;
    for(let i = 0; i < data.length; i++){
        let newStr = getNewDescription(data[i].description);
        data[i].description = newStr;
    }
    res.render('summary/tag', { data , tag, currentPage, totalPages, temp });
});

router.get('/', async (req, res) => {
    let { page, skip, limit } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    skip = parseInt(skip);
    if(!page || page < 0 ){
        page = 1;
    }
    if(!skip || skip < 0){
        skip = 4;
    }
    if(!limit || limit < 0){
        limit = 4;
    }
    const currentPage = parseInt(page);
    let temp = currentPage;
    if(temp != 1){
        temp--;
    }
    const count = await Summary.countDocuments();
    const totalPages = Math.ceil(count/limit);
    if(page > totalPages){
        temp = totalPages - 1;
        page = totalPages;
    }
    const data = await Summary.find({}).skip((page - 1) * skip).limit(limit).sort({"createdAt": -1});
    for(let i = 0; i < data.length; i++){
        let newStr = getNewDescription(data[i].description);
        data[i].description = newStr;
    }
    res.render('summary/index', { data , totalPages, currentPage, temp });
});

module.exports = router;