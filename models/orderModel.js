// orderItems - [product1, product2. .............], user, orderTotal,shippingAddress

const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderSchema = mongoose.Schema({
    orderItemIds:[{
        type:[ObjectId],
        ref: 'OrderItem',
        required: true
    }],
    user:{
        type: ObjectId,
        ref: 'User',
        required: true

    },
    total:{
        type:Number,
        required: true,
    },
    shipping_address:{
        type: String,
        required: true
    },
    opt_shipping_address:{
        type:String
    },
    country:{
        type: String,
        required: true

    },
    city:{
        type:String,
        required: true
    },
    zipcode:{
        type: Number,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        default:"pending"
    }


})

module.exports = mongoose.model('Order', orderSchema)