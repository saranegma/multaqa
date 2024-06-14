const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async function (req, res) {
    try {
        let newUser = new userModel(req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        newUser.password = hashedPassword;

        let user = await newUser.save();
        console.log(user);
        return res.status(200).json({ message: "User registered successfully", data : user });
    } catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

exports.login = async function (req, res) {
    try {
      let user = await userModel.findOne({ email: req.body.email });
      if (!user || !(await user.comparePassword(req.body.password))) {
        return res.status(401).json({ message: "Authentication failed, Invalid email or password" });
      }
  
      return res.json({ message: "User logged in successfully", fname: user.fname, data: user });
    } catch (error) {
      return res.status(400).send({ message: error });
    }
  }
