const express = require('express');
const routs = express.Router();

const mongoose = require('mongoose');

const SubCategory = require('../../models/subCategory');
const Category = require('../../models/category');

routs.get('/', (req,res,next) =>{
    SubCategory.find()
               .populate('category')
               .exec()
               .then(subcat => {
                   if(subcat.length <= 0){
                       res.json({
                           message: "Data not found"
                       })
                   }
                   else{
                       res.status(200).json({
                            count: subcat.length,
                            data: subcat
                       })
                   }
               })
               .catch(err =>{
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
})

routs.post('/', (req,res,body)=>{
    Category.findById(req.body.categoryId)
            .then(cat =>{
                if(!cat){
                    res.status(404).json({message: "Category not found"})                    
                }else{

                    const subCategory = new SubCategory({
                        _id: new mongoose.Types.ObjectId(),
                        category: req.body.categoryId,
                        name: req.body.name,
                        description: req.body.description,
                        image: req.body.image,
                        status: req.body.status

                    });

                    return subCategory.save();
                }
            })
            .then(subCat => {
                const subcatObj = {
                    message: "Sub Category added successfully",
                    SubCat: {
                        _id: subCat._id,
                        categoryId: subCat.categoryId,
                        description: subCat.description,
                        image: subCat.image,
                        status: subCat.status
                    }
                }

                res.status(200).json(subcatObj)
            })
            .catch(err =>{
                console.log(err)
                res.status(500).json({
                    error: err
                })
            })
});

routs.delete

module.exports = routs;
