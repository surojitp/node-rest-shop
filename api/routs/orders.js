const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const Product = require('../../models/product');
const mongoose = require('mongoose');
const checkAuth = require('../middlewere/chech-auth');

const order_controller = require('../controller/order');

router.get('/', checkAuth, order_controller.order_get_all);

router.get('/:orderId', checkAuth, order_controller.get_single_order)

router.post('/', checkAuth, order_controller.create_single_order);



router.delete('/:orderId', checkAuth, order_controller.delete_order);

module.exports = router;

