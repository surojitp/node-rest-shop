const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../../models/user');

const bcrypt = require('bcrypt-nodejs');
const jsonwebtoken = require('jsonwebtoken');

const userController = require('../controller/user');

router.post('/signup',(req,res)=>{

  userController.signup(req.body,(data)=>{
    res.send(data)
  })
}

);

router.post('/login', userController.user_login);

router.delete('/:userId', userController.user_delete)

module.exports = router;