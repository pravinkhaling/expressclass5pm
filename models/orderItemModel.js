// product, quantity,[id]

const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema
const orderItemSchema = mongoose.Schema({
    product: {
        type: ObjectId,
        ref:'Product',
        required: true
    },
    quantity:{
        type:Number,
        required:true
    }
})

module.exports= mongoose.model('OrderItem', orderItemSchema)