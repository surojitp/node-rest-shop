const mongoose = require('mongoose');
var async = require('async');
const Category = require('../../models/category');
var Subcategory = require('../../models/subCategory');

exports.get_all_category = (req, res, next) => {
    
    Category.find().exec()
    .then(cat => {
        // //console.log(cat)
        // var catlist=[]
        
        // async.each(cat,function(item,cb){
        //     var itemval={}
        //     Subcategory.find({category:item._id})
        //                 .exec(function(err,res){
                
        //                     itemval['category']=item
        //                     itemval['subcat']=res
                            
        //                     catlist.push(itemval)
        //                     cb()
                
        //                 })
            
            
            
            
        // },function(){
        //                 res.status(200).json(catlist);

            
        // })
        const responce = {
            count: cat.length,
            category: cat.map(doc=>{
                return {
                    _id: doc._id,
                    name: doc.name,
                    description: doc.description,
                    image: doc.image,
                    status: doc.status
                }
            })
        }
        if(cat.length > 0){
            res.status(200).json(responce);
        }
        else{
            res.json({message: "category not found"});
        }
        
        
        
        
    })
    .catch()
}

exports.get_category_with_sub_category = (req,res,next) => {
    
    Category.find()
            .exec()
            .then(cat =>{
                var categoryList = [];
                
                async.each(cat,(item,cb) =>{
                    var blnk_obj = {};
                    
                    Subcategory.find({category: item._id})
                               .exec((err,res)=>{
                                blnk_obj['category'] = item;
                                blnk_obj['sub_cat'] = res;

                                categoryList.push(blnk_obj);
                                cb();
                               })


                },() =>{
                    res.status(200).json(categoryList)
                })
            })
            .catch(err=>{
                console.log(err)
            })
}

exports.create_category = (req,res,next) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        status: req.body.status
    });
    
    category.save()
    .then(cat =>{
        res.status(201).json({
            message: "Category added",
            data: cat 
        })
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        })
    })
}