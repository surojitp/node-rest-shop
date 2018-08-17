const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const productController = require('../controller/product');

const checkAuth = require('../middlewere/chech-auth');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callBack){
        callBack(null,'./uploads/');
    },
    filename: function(req, file, callBack){
        //callBack(null, new Date().toISOString() + file.originalname);
        callBack(null, file.originalname);
    }
})

const fileFilter = (req,file,callBack) =>{

    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        callBack(null,true);
    }else{
        callBack(null,false);
    }
}
//const upload = multer({dest: 'uploads/'});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../../models/product');

router.get('/', productController.get_all_products);

router.get('/:productId', productController.get_single_product);

router.get('/byCategory/:categoryId', productController.get_product_by_category);

router.get('/bySubCategory/:subCategoryId', productController.get_product_by_subCategory);

router.post('/', checkAuth, upload.single('productImage'), productController.post_product)

router.patch('/:productId', checkAuth, productController.update_product);

router.delete('/:productId', checkAuth, productController.delete_product);

module.exports = router;

