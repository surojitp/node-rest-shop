const mongoose = require('mongoose');
const Product = require('../../models/product');

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

exports.get_single_product = (req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
            .select('name price _id productImage')
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
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
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
