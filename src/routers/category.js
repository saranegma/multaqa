const express=require('express')

const router=express.Router()
const Category=require('../models/category')


router.post('/category', async (req,res)=>{
   try {
    const categoryData= {
        title:req.body.title,
        type:req.body.type,
        description:req.body.description
    };
    const category= new Category(categoryData);
    await category.save();
    res.status(200).send(category);
   }
    catch (error) { 
        res.status(500).send({fault:error.message});
    
   };
   

});

////////////Get(retrive)//////////

router.get('/category', async (req, res) => {
    try {
        const Categories = await Category.find();
        res.status(200).send(Categories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

//////////////////////GET (search) BY ID////////////////////////////

router.get('/category/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!Category) {
            return res.status(404).send({ message: 'category not found' });
        }
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

/////////Delete all categories///////////
router.delete('/category', async (req,res)=>{
    const result = await Category.deleteMany({});
try{
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'No category found' });
        }

        res.status(200).send({ message: 'All categories deleted successfully' });
    } catch (e) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});



module.exports=router