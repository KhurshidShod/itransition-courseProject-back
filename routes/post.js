const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const { route } = require('./auth')
const Post = mongoose.model("Post")

router.post('/createpost', requireLogin, (req, res) => {
    const {title, body, photos, review, genre} = req.body
    console.log(title, body, photos, review);
    if(!title || !body){
    return res.status(422).json({msg: "Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photos,
        review,
        genre,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({post: result})
    })
    .catch(err => {
        console.log(err)
    })
})
router.get('/myposts', requireLogin, (req,res) => {
    Post.find({
        postedBy:req.user._id,
    })
    .populate('postedBy', '_id name')
    .then(mypost => {
        res.json({mypost})
    })
    .catch(err => {
        console.log(err)
    })
})
router.get('/allposts',(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text: req.body.text,
        postedBy:req.user._id,
        commentReview: req.body.commentReview
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate('comments.postedBy')
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

module.exports = router