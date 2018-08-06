const mongoose = require('mongoose');
const Category = require('../../models/category');

exports.get_all_category = (req, res, next) => {
    Category.find()
            .exec()
            .then(cat => {
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