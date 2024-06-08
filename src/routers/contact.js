const express = require('express')
const Contact = require('../models/contact')
const router = express.Router()

////////////////POST/////////////////

router.post('/contact-us', async (req, res) => {
    try {
        const contact = new Contact(req.body)
        await contact.save()
        res.status(201).send(contact)
    } catch (e) {
        res.status(400).send(e)
    }
})

//////////////////GET//////////////////////////

router.get('/contactUs', async (req, res) => {
  try {
      const contact = await Contact.find({})
      res.status(200).send(contact)
  } catch (e) {
      res.status(500).send(e)
  }
});

//////////////////////GET BY EMAIL////////////////

router.get('/contactUs/email/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const contact = await Contact.findOne({ email }); // Find by email address
  
      if (!contact) {
        return res.status(404).send('Unable to find');
      }
      res.status(200).send(contact);
    } catch (e) {
      res.status(500).send(e);
    }
  });

//////////////PATCH//////////////////////////

router.patch('/contactUs/:email', async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const contact = await Contact.findOne({ email: req.params.email });
        if (!contact) {
            return res.status(404).send('Not found');
        }
  
        updates.forEach((update) => (contact[update] = req.body[update]));
        await contact.save();
        res.status(200).send(contact);
    } catch (error) {
        res.status(400).send(error);
    }
  });

////////////////////////////////DELETE///////////////////////

router.delete('/contactUs/:email', async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({ email: req.params.email });
        if (!contact) {
            return res.status(404).send('Unable to find');
        }
        res.status(200).send(contact);
    } catch (e) {
        res.status(500).send(e);
    }
  });

////////////////////DELETE ALL/////////

// Delete all 
router.delete('/cotactUs', async (req, res) => {
  try {
      const result = await Contact.deleteMany({});
      if (result.deletedCount === 0) {
          return res.status(404).send('No messages found to delete');
      }
      res.status(200).send({ message: `Deleted ${result.deletedCount} contact` });
  } catch (e) {
      res.status(500).send(e);
  }
});


module.exports = router;