const express=require('express')
const router= express.Router()
const BankAccount=require('../models/BankAccount')

router.post('/bankAccount', async (req, res) => {
    try {
      const bankAccount = new BankAccount(req.body);
      await bankAccount.save();
      res.status(201).send(bankAccount);
    } catch (err) {
      res.status(400).send({error:err.message});
    }
  });
  
  // retrive  all bank accounts
  router.get('/bankAccounts', async (req, res) => {
    try {
      const bankAccounts = await BankAccount.find();
      res.status(200).send(bankAccounts);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  // retrive a bank acc by its id///////
  router.get('/bankAccount/:id',async (req,res)=>{
    try {
        const bankAcc= await BankAccount.findById(req.params.id)
        if (!bankAcc){
            res.status(404).send({message:'bank account is not found '})
        
        }
        res.status(200).send(bankacc)

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
  })

/////////update bank acc by its id///////////
router.put('/bankAccount/:id', async (req, res) => {
    try {
      const updates = req.body;
      const options = { new: true, runValidators: true };
      const bankAccount = await BankAccount.findByIdAndUpdate(req.params.id, updates, options);
      if (!bankAccount) {
        return res.status(404).send({ message: 'Bank account not found' });
      }
      res.send(bankAccount);
    } catch (error) {
      res.status(400).send(error);
    }
})
//////////////delete by id///////////
router.delete('/bankAccount/:id', async (req, res) => {
    try {
      const bankAccount = await BankAccount.findByIdAndDelete(req.params.id);
      if (!bankAccount) {
        return res.status(404).send({ message: 'Bank account not found' });
      }
      res.send({ message: 'Bank account deleted successfully', deletedAccount: bankAccount });
    } catch (error) {
      res.status(500).send(error);
    }
  });













  module.exports=router
