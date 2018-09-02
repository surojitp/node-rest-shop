var mongoose = require('mongoose');

var cartSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    image: String,
    productName: String,
    color: String,
    quantity: Number,
    unitPrice: Number,
    price: Number

});

module.exports = mongoose.model('Cart',cartSchema);