
const mongoose = require('mongoose');
const User = require('../../models/user');

const bcrypt = require('bcrypt-nodejs');
const jsonwebtoken = require('jsonwebtoken');

exports.signup =  (req,res,next) =>{

    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1){
               
                // return res.status(409).json({
                //     message: "Email already use"
                // })
                return res.status(409).send({status:409, Message: 'internal error', type:'internal'}); 
            }else{

                

                // bcrypt.hash(req.body.password, 10, null, (err, hash) =>{
                //     if(err){
                //         return res.status(500).json({
                //             error: err,
                //             message: "wrong"
                //         })
                    
                //     }else{

                //         res.status(201).json({
                //                         message: "User createddddd"
                //                     })
            
                //         // const user = new User({
                //         //     _id: new mongoose.Types.ObjectId(),
                //         //     email: req.body.email,
                //         //     password: hash
                //         // });
            
                //         // user.save()
                //         //     .then(result =>{
                //         //         console.log(result)
                //         //         res.status(201).json({
                //         //             message: "User created"
                //         //         })
                //         //     })
                //         //     .catch(err=>{
                //         //         console.log(err)
                //         //         res.status(500).json({
                //         //             error: err
                //         //         })
                //         //     })
                        
                //     }
                // })

                var hash = bcrypt.hashSync(req.body.password);

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

                // res.status(201).json({
                //     message: "kkkkkkkkkkkkkk"
                // })

            }
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error: err
            })
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
            else{
            // bcrypt.compare(req.body.password, user[0].password, (err,result) =>{
            //     if(err){
            //         return res.status(401).json({
            //             mesage: "Authentication failed"
            //         });
            //     }
            //     //res.send(result+" "+req.body.password+" "+ user[0].password)
            //     if(result){
            //         const token = jsonwebtoken.sign(
            //             {
            //                 email: user[0].email,
            //                 userId: user[0]._id
            //             },
            //             process.env.JWT_KEY,
            //             {
            //                 expiresIn: "1h"
            //             }
            //         )
            //         return res.status(200).json({
            //             mesage: "Authentication Successfull",
            //             token: token,
            //             userId: user[0]._id,
            //             email: user[0].email
            //         });
            //     }else{
            //         return res.status(401).json({
            //             mesage: "Authentication failed"
            //         })

            //     }
                
            // })
                

                if(bcrypt.compareSync(req.body.password, user[0].password)){

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
                                    userId: user[0]._id,
                                    email: user[0].email
                                });


                }
                else{
                    return res.status(401).json({
                        mesage: "Authentication failed"
                    })

                }


            }


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