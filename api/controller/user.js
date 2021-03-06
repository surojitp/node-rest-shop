
const mongoose = require('mongoose');
const User = require('../../models/user');

const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

exports.signup =  (req,res,next) =>{

    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    message: "Email already use"
                })
            }else{

                bcrypt.hash(req.body.password, 10, (err, hash) =>{
                    if(err){
                        return res.status(500).json({
                            error: err
                        })
                    
                    }else{
            
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
            
                        user.save()
                            .then(result =>{
                                console.log(result)
                                res.status(201).json({
                                    message: "User created"
                                })
                            })
                            .catch(err=>{
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                })
                            })
                        
                    }
                })

            }
        })    

}

exports.user_login = (req, res, next)=>{
    User.find({email: req.body.email})
        .exec()
        .then(user =>{
            if(user.length < 1){
                return res.status(401).json({
                    mesage: "Authentication failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err,result) =>{
                if(err){
                    return res.status(401).json({
                        mesage: "Authentication failed"
                    });
                }
                //res.send(result+" "+req.body.password+" "+ user[0].password)
                if(result){
                    const token = jsonwebtoken.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        mesage: "Authentication Successfull",
                        token: token,
                        userId: user[0]._id
                    });
                }else{
                    return res.status(401).json({
                        mesage: "Authentication failed"
                    })

                }
                
            })
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}

exports.user_delete = (req,res,next)=>{
    const id = req.params.userId;
    const query = {_id: id}
    User.remove(query)
        .exec()
        .then(result=>{
            res.status(200).json({
                message: "user Deleated"
            })
        })
        .catch(err=>{
            res.status(500).json({
                error: err
            })
        })
}