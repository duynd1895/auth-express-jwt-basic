const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('./../models/user');

router.post('/register', async (req, res) => {
     //Kiem tra xem da ton tai email hay chua?
     const exitEmail = await User.findOne({email: req.body.email});
     if (exitEmail) {
          res.status(400).send('Email đã tồn tại');
     }
     const salt = await bcrypt.genSaltSync(10);
     const hasedPassword = await bcrypt.hashSync(req.body.password, salt);
     const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hasedPassword
     });
     try {
          const savedUer = await user.save();
          res.send({ User: savedUer});
     } catch (err) {
          res.status(400).send({ Error: err});
     }
});

router.post('/login', async (req, res) => {
     const user = await User.findOne({email: req.body.email});
     if (!user) {
          res.status(400).send('Email is not found');
     }
     const validPass = await bcrypt.compare(req.body.password, user.password);
     if (!validPass) {
          res.status(400).send('Invalid password');
     }
     const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
     res.header('auth-token', token).send(token);
});

module.exports = router;