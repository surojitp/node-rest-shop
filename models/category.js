const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    image: String,
    status: Number
});

module.exports = mongoose.model('Category', categorySchema);