const express = require('express');
const router = express.Router();
const DeleteRequest = require('../models/deleteRequests');
const auth = require('../middelware/auth'); // Your authentication middleware

router.post('/delete-request',  async (req, res) => {
  try {
    const { user_id, target_id, target_type, reason } = req.body;
    //const user_id = req._id; // Assuming req.user contains authenticated user info

    const newDeleteRequest = new DeleteRequest({
      user_id,
      target_id,
      target_type,
      reason
    });

    await newDeleteRequest.save();
    res.status(201).send(newDeleteRequest);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;