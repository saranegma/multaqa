
const adminModel = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async function(req, res) {
  try {
    let newAdmin = new adminModel(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    newAdmin.password = hashedPassword;
    let admin = await newAdmin.save();
    const token = await admin.generateAuthToken();

    return res.status(200).json({ message: "Admin registered successfully", token });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
}

exports.login = async function(req, res) {
  try {
    let admin = await adminModel.findOne({ email: req.body.email });
    if (!admin || !(await admin.comparePassword(req.body.password))) {
      return res.status(401).json({ message: "Authentication failed, Invalid email or password" });
    }
    const token = await admin.generateAuthToken();

    return res.json({ 
      message: "Admin logged in successfully", 
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        // Include other admin fields as needed
      }
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};
