const express = require('express');
const mongoose= require('mongoose')
const router= express.Router()
const Category = require('../models/category') 
const Event = require('../models/event');


router.get('/events/by-category/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;

        
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({ error: 'Category not found' });
        }

        const events = await Event.aggregate([
            {
                $match: {
                    category_id: new mongoose.Types.ObjectId(categoryId)
                }
            },
            {
                $lookup: {
                    from: 'categories', 
                    localField: 'category_id', 
                    foreignField: '_id', 
                    as: 'category'
                }
            },
            {
                $unwind: '$category' 
            },
            {
                $project: {
                   _id:0,
                    title: 1,
                    description: 1,
                    type: 1,
                    time: 1,
                    date: 1,
                    location: 1,
                    photos:1,
                    category: '$category.title' 
                }
            }
        ]);

        res.status(200).send(events);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});













module.exports=router