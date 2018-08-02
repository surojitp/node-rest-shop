const Order = require('../../models/order');
const Product = require('../../models/product');
const mongoose = require('mongoose');

exports.order_get_all = (req,res,next) => {

    Order.find()
        .populate('product','_id name price')
        .exec()
        .then(docs => {
            if(docs.length > 0){
                res.status(200).json({
                    message: "Handeling Get request to /orders",
                    count: docs.length,
                    orders: docs.map(doc =>{
                        return {
                            id: doc._id,
                            product: doc.product,
                            quantity: doc.quantity,
                            request: {
                                type: "GET",
                                url: "http://localhost:3000/orders/"+doc._id
                            }
                        }
                    })
                })
            }
            else{
                res.status(200).json({
                    message: "Empty data"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    
}

exports.get_single_order = (req,res,next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .populate('product')
        .select("_id product quantity")
        .exec()
        .then(order =>{
            if(!order){
                return res.status(404).json({
                    message:"data not found"
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            })
        })
        .catch(err =>{
            res.status(500).json({
                error:err
            })
        })
   
}

exports.create_single_order = (req,res,next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product){
                return res.status(404).json({message:"product not found"})
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: "Orderd stored",
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: "GET",
                    url: `http://localhost:3000/orders/${result._id}`
                }
            })
        }) 
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    
}

exports.delete_order = (req,res,next) => {
    const id = req.params.orderId;
    const query = {_id: id}
    
    Order.remove(query)
        .exec()
        .then(result =>{
            res.status(200).json({
                message: "Order deleted",
                request: {
                    type: "POST",
                    url: `http://localhost:3000/orders/`,
                    body: {
                        productId: "ID",
                        quantity: "Number"
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}