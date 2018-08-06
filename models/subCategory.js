const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:true,
    },
    name: String,
    description: String,
    image: String,
    status: Number

});

module.exports = mongoose.model('SubCategory', subCategorySchema);