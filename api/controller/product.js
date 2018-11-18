const mongoose = require('mongoose');
const Product = require('../../models/product');
const Category = require('../../models/category');
const subCategory = require('../../models/subCategory');

exports.get_all_products = (req,res,next) => {
    Product.find()
        .select("name price _id productImage")
        .then((docs)=>{
            const responce = {
                count: docs.length,
                product: docs.map(doc=>{
                    return {
                        name:   doc.name,
                        price:  doc.price,
                        _id:    doc._id,
                        image: doc.productImage,
                        request:{
                            type: 'GET',
                            url: `http://localhost:3000/products/${doc._id}`
                        }
                    }
                })
            }
            if(docs.length > 0 ){
                res.status(200).json(responce)

            }else{
                res.json({message:"No data found"})
            }
            
        })
        .catch(err=>{
            res.status(500).json({
                error: err
            })
        })
    
}
exports.get_product_by_category = (req,res) => {

        const categoryId = req.params.categoryId;
        const query = {category: categoryId}
        Product.find(query)
             
               .then(doc => {
                   if(doc.length < 1){
                       res.status(204).json({success:false,count: doc.length})
                  
                  
                    }
                   else{
                       const responce = {
                            count: doc.length,
                            product: doc.map(p=>{
                                return {
                                    id:p._id,
                                    name: p.name,
                                    description: p.description,
                                    price: p.price,
                                    productImage: p.productImage,
                                    color: p.color,
                                    category: p.category,
                                    subCategory: p.subCategory
                                    

                                }
                                
                            })
                       }
                       res.status(200).json({success:true,data:responce})
                   }
               })
               .catch(function(err){
                res.status(401).json({success:false,data:err})

               })
}

//////// by subCtegory

exports.get_product_by_subCategory = (req,res,next) => {

    const subCategoryId = req.params.subCategoryId;
    const query = {subCategory: subCategoryId}
    Product.find(query)
           .exec()
           .then(doc => {
               if(doc.length <= 0){
                   res.status(204).json({count: doc.length})
               }
               else{
                   const responce = {
                        count: doc.length,
                        product: doc.map(p=>{
                            return {
                                id:p._id,
                                name: p.name,
                                description: p.description,
                                price: p.price,
                                productImage: p.productImage,
                                color: p.color,
                                category: p.category,
                                subCategory: p.subCategory
                                

                            }
                            
                        })
                   }
                   res.status(200).json(responce)
               }
           })
           .catch()
}
exports.get_single_product = (req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
            //.select('name price _id productImage')
            .exec()
            .then((doc)=>{
                //console.log(doc);
                if(doc){
                    res.status(200).json({
                        product:    doc,
                        request:    {
                            type: 'GET',
                            url:  'http://localhost:3000/products'
                        }
                    })
                }else{
                    res.status(404).json({
                        message: "No data found for Product Id"
                    })
                }
                
            })
            .catch((err)=>{
                console.log(err)
                res.status(500).json({error:err})
            })
    ;
    // res.status(200).json({
    //     message: "Handeling Get request to /products",
    //     id:id
    // })
}

exports.post_product = (req,res,next) => {
    // const product = {
    //     name:req.body.name,
    //     price:req.body.price
    // }
    //console.log(req.file);
    Category.findById(req.body.category)
            .then(cat =>{
                if(!cat){
                    return res.status(404).json({
                        message: "Category not found"
                    })
                }else{
                    subCategory.findById(req.body.subCategory)
                                .then(scat =>{
                                    return res.status(404).json({
                                        message: "Sub Category not found"
                                    })
                                })
                }
            })
            .catch(err =>{
                console.log(err)
                return res.status(500).json({
                    message: "Something Wrong in category & Sub Category",
                    error: err
                })
            })


    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        category: req.body.category,
        subCategory: req.body.subCategory,
        description: req.body.description,
        color: req.body.color,
        name: req.body.name,
        price:req.body.price,
        productImage: req.file.path
    })

    product
        .save()
        
        .then(result =>{
            //console.log(result)
            res.status(200).json({
                message: "Product Added Successfully",
                createdProduct: {
                    category: result.category,
                    subCategory: result.subCategory,
                    description: result.description,
                    color: result.color,
                    name:   result.name,
                    price:  result.price,
                    _id:    result._id,
                    request:{
                        type: 'GET',
                        url:  `http://localhost:3000/products/${result._id}`
                    }
                }
            })
        })
        .catch(err =>{
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
    
}

exports.update_product = (req,res,next) => {
    const id = req.params.productId;
    const updateOps = {}
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id},{$set: updateOps})
        .exec()
        .then(r=>{
            res.status(200).json({
                message: "Product Updated",
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${r._id}`
                }
            })
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        })

    
}

exports.delete_product = (req,res,next) => {
    const id = req.params.productId;
    const query = {
        _id: id
    }
    Product.remove(query)
        .exec()
        .then(r=>{
            res.status(200).json({
                message: "Product Deleted",
                request:{
                    type: "POST",
                    url: 'http://localhost:3000/products',
                    body:{ 
                        name: 'String',
                        price: 'Number'
                    }
                }
            })

        })
        .catch(err=>{
            res.status(500).json({
                error: err
            })
        })
    
}
