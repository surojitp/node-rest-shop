const express = require('express');
const mongoose = require('mongoose');
const routes = express.Router();

const checkAuth = require('../middlewere/chech-auth');

const Cart = require('../../models/cart');

routes.get("/:userId",(req,res,next)=>{
    //const userId = req.params.userId;
    let query = {userId: req.params.userId};

    Cart.find(query)
        .select("_id userId productId image productName color quantity unitPrice price")
        .exec()
        .then(products =>{
            if(products.length <1){
                res.status(204).json({count: products.length,message: "No product found"})
            }
            else{

                const responce = {
                    count: products.length,
                    data: products.map( product =>{
                        return {
                            _id:            product._id,
                            userId:         product.userId,
                            productId:      product.id,
                            image:          product.image,
                            productName:    product.productName,
                            color:          product.color,
                            quantity:       product.quantity,
                            unitPrice:      product.unitPrice,
                            price:          product.price
                        }
                    })
                }

                res.status(200).json(responce)
            }
        })
        .catch(err => {
            res.status(500).json({error: err})
        })
})

routes.post('/',checkAuth,(req,res,next)=>{

    var msg = "";

    var query = {userId: req.body.userId, productId: req.body.id, color: req.body.color}
    Cart.findOne(query)
        .then(cartItem =>{
            console.log('cart',cartItem)
            if(cartItem){

                var qty = (parseInt(cartItem.quantity) + parseInt(req.body.quantity));

                var newPrice = (parseInt(cartItem.price) + parseInt(req.body.price));

                const updateObj = {
                    quantity: qty.toString(),
                   
                    price: newPrice.toString()         
                }

                console.log('upp',updateObj)

                msg = "Product updated successfully";

                return Cart.update(query,{$set: updateObj})

                

            }
            else{

                const cartProduct = new Cart({
                    _id:            new mongoose.Types.ObjectId(),
                    userId:         req.body.userId,
                    productId:      req.body.id,
                    image:          req.body.image,
                    productName:    req.body.productName,
                    color:          req.body.color,
                    quantity:       req.body.quantity,
                    unitPrice:      req.body.unitPrice,
                    price:          req.body.price
                })

                console.log(cartProduct)

                msg = "Product added successfully";

                return cartProduct.save();

                
            }
        })
        .then(product =>{

            const responce = {
                message: msg,
                userId:         req.body.userId,
                productId:      req.body.id,
            }

            res.status(200).json(responce);

        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        })

})

routes.delete('/:cartId',(req,res,next)=>{

    const query = {_id: req.params.cartId}

    Cart.remove(query)
        .exec()
        .then(responce => {
            var msg = "product remove successfully";
            //console.log(responce.n);
            if(responce.n === 0){
                msg = "Product already romoved"
            }

            res.status(200).json({message: msg})
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        })

})

module.exports = routes;