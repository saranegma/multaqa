const express = require('express');
const adminController = require('../Controllers/adminController');
const auth = require('../middelware/auth');
const User=require('../models/user')
const Event =require('../models/event')
const Attendee=require('../models/attendee')
const Organizer=require('../models/organizer.js')
const Complaint =require('../models/complaint.js')
const Contact =require('../models/contact.js')
const Deleterequest =require('../models/deleteRequests.js')
const mongoose = require('mongoose');

const router = express.Router();

// Register Admin
router.post('/admin/register', adminController.register);


// Login Admin
router.post('/admin/login', adminController.login);



/////////////////Get all complaints //////////

router.get('/complaint', async (req, res) => {
  try {
    const reports = await Complaint.find({});
    res.status(200).send(reports);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
/////////////////Get all complaints //////////

router.get('/contactUs', async (req, res) => {
  try {
    const contacts = await Contact.find({});
    res.status(200).send(contacts);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
/////////////retrive a complaint with an id//////////////

router.get('/complaint/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).send({ error: 'Complaint not found' });
    }

    res.status(200).send(complaint);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
////////////delete complaint by id////////////
router.delete('/complaint/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).send({ error: 'Complaint not found' });
    }

    res.status(200).send({ message: 'Complaint deleted successfully', complaint });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

////////////delete contacts by id////////////
router.delete('/contact-Us/:id', async (req, res) => {
  try {
      const contact = await Contact.findOneAndDelete(req.params.id);
      if (!contact) {
          return res.status(404).send('Contact not found');
      }
      res.status(200).send({ message: 'Complaint deleted successfully', contact });
  } catch (e) {
      res.status(500).send({ error: e.message });
  }
});


////////////////delete all reports////////////
router.delete('/complaint', async (req, res) => {
  try {
    const result = await Complaint.deleteMany({});

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'No complaints found to delete' });
    }

    res.status(200).send({ message: 'All complaints deleted successfully', deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

////////////get event's revenue///////////
//////شيرين دا هيرجعلك العنوان ةالتاريخ والربح لو مش عايزاهم وعايزه كل الايفنت امسحي ال 
///////.select('title date websiteRevenue');
router.get('/eventRevenue/:id', async (req, res) => {
  try {
      const event = await Event.findById(req.params.id).select('title date websiteRevenue');
      if (!event) {
          return res.status(404).send({ message: 'Event not found' });
      }
   
      res.status(200).send(event);
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
});

//////////////////////requests for delete//////////


// Admin gets all delete requests
router.get('/delete-requests',  async (req, res) => {
  try {
    const deleteRequests = await Deleterequest.find()//.populate('user_id').exec();
    res.status(200).send(deleteRequests);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


router.get('/admin/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error occurred during logout.")
      } else {
        return res.status(200).send("Logout successful.")
      }
    })
  } else {
    return res.status(400).send("No active session to log out from.")
  }
})







router.patch('/delete-request/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const deleteRequest = await Deleterequest.findById(req.params.id);

    console.log(status);
    console.log(req.params.id);
    if (!deleteRequest) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).send({ message: 'Delete request not found' });
    }

    deleteRequest.status = status;
    await deleteRequest.save({ session });

    if (status === 'Approved') {
      if (deleteRequest.target_type === 'User') {
        const userId = deleteRequest.target_id;

        // Delete the user
        await User.findByIdAndDelete(userId, { session });

        // Delete the associated attendee or organizer
        await Attendee.deleteOne({ user_id: userId }, { session });
        await Organizer.deleteOne({ user_id: userId }, { session });

      } else if (deleteRequest.target_type === 'Event') {
        await Event.findByIdAndDelete(deleteRequest.target_id, { session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).send(deleteRequest);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ message: error.message });
  }
});




// Admin approves or rejects a delete request
router.patch('/delete-request/:id', async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const deleteRequest = await Deleterequest.findById(req.params.id);

    if (!deleteRequest) {
      return res.status(404).send({ message: 'Delete request not found' });
    }

    deleteRequest.status = status;
    await deleteRequest.save();

    if (status === 'Approved') {
      if (deleteRequest.target_type === 'user') {
        await User.findByIdAndDelete(deleteRequest.target_id);
        
      } else if (deleteRequest.target_type === 'event') {
        await Event.findByIdAndDelete(deleteRequest.target_id);
      }
    }

    res.status(200).send(deleteRequest);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});





































module.exports = router;





































/*
// POST method (if admin has 'create' permission)
router.post('/', async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId); // Replace with actual admin ID retrieval
    if (!admin || !admin.permissions.includes('create')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.status(201).json({ message: 'Admin created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET method  (if admin has 'read' permission)
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId); // Replace with actual admin ID retrieval
    if (!admin || !admin.permissions.includes('read')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.status(200).json({ message: 'Admin retrieved', adminId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH method  (if admin has 'update' permission)
router.patch('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId); // Replace with actual admin ID retrieval
    if (!admin || !admin.permissions.includes('update')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.status(200).json({ message: 'Admin updated', adminId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE method (if admin has 'delete' permission)
router.delete('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId); // Replace with actual admin ID retrieval
    if (!admin || !admin.permissions.includes('delete')) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.status(200).json({ message: 'Admin deleted', adminId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
*/
module.exports = router;
