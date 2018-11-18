const express = require('express');
const router = express.Router();
const categoryRouts = require('../controller/category');



router.get('/', categoryRouts.get_all_category);

router.get('/categryWithSub', categoryRouts.get_category_with_sub_category);

router.post('/', categoryRouts.create_category);

module.exports = router;