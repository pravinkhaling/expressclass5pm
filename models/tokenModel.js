const mongoose =require('mongoose')

const {ObjectId} = mongoose.Schema

const tokenSchema = mongoose.Schema({
    token:{
        type:String,
        required: true
    },
    user:{
        type: ObjectId,
        ref: 'User',
        required:true
    },
    cratiedAt:{
        type:Date,
        default: Date.now(),
        expires: 86400
    }
})

module.exports = mongoose.model ("Token", tokenSchema)