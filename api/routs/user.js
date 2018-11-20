const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = require('../../models/user');

const bcrypt = require('bcrypt-nodejs');
const jsonwebtoken = require('jsonwebtoken');

var cors = require('cors');

var corsOptions = {
  origin: 'https://restshopingcart.herokuapp.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const userController = require('../controller/user');

router.post('/signup', cors(corsOptions), userController.signup);

router.post('/login', userController.user_login);

router.delete('/:userId', userController.user_delete)

module.exports = router;