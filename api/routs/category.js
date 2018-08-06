const express = require('express');
const router = express.Router();
const categoryRouts = require('../controller/category');



router.get('/', categoryRouts.get_all_category);

router.post('/', categoryRouts.create_category);

module.exports = router;