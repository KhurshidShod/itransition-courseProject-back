const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../db')
const requireLogin = require('../middleware/requireLogin')

// router.get('/protected',requireLogin,(req, res) => {
//     res.send("Hello user")
// })

router.post('/signup', (req,res) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password ){
        res.json({err: 'Please make sure all inputs are filled'})
    }
    User.findOne({email: email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({msg: "User already exists"})
        }
        bcrypt.hash(password, 12)
        .then(hashedPass => {
            const user = new User({
                name,
                email,
                password:hashedPass,
            })
            user.save()
            .then(user => {
                res.json({msg: "Saved successfully"})
            })
            .catch(err => {
                console.log(err)
            })
        })
    })
    .catch(err => {
        console.log(err);
    })
})
router.get('/user',requireLogin,(req,res) => {
    User.find({
        email: req.user.email
    })
    .then(me => {
        console.log({me});
        res.json({me})
    })
    .catch(err => {
        console.log(err)
    })
})
router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"Please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router