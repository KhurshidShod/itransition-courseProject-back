const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photos: [String],
    review: {
        type: Number,
        default: null
    },
    genre: {
        type: String,
        required: true
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    comments: [{
        text: String,
        commentReview: Number,
        postedBy:{type:ObjectId,ref:"User"}
    }]
})
mongoose.model('Post', postSchema)