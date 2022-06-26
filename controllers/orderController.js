const Order = require('../models/orderModel')
const OrderItem = require('../models/orderItemModel')

exports.placeOrder = async(req,res) =>{
    let orderItemIds = await Promise.all(req.body.orderItems.map(async(orderItem_user)=>{
        let orderItem = new OrderItem({
            product : orderItem_user.product,
            quantity: orderItem_user.quantity
        })
        orderItem = await orderItem.save()
        if(!orderItem){
            return res.status(400).json({error:"Failed to place order/adding items."})
        }
        return orderItem._id
    }))

    let individualTotalPrice = await Promise.all((await orderItemIds).map(async(item)=>{
        let orderItem = await OrderItem.findById(item).populate('product','product_price')
        const totalPrice = orderItem.product.product_price * orderItem.quantity
        return totalPrice

    }))

    const totalPrice = await individualTotalPrice.reduce((acc, cur)=>acc+cur)

    let order = new Order({
        orderItemIds: orderItemIds,
        user : req.body.user,
        total: totalPrice,
        shipping_address: req.body.shipping_address,
        opt_shipping_address: req.body.opt_shipping_address,
        country: req.body.country,
        city: req.body.city,
        zipcode: req.body.zipcode,
        phone: req.body.phone
    })

    order = await order.save()
    if(!order){
        return res.status(400).json({error: "failed to place order"})
    }
    res.send(order)

}

// to view orders
exports.orders = async(req,res)=>{
    let order = await Order.find().populate('user','username')
    if(!order){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(order)
}

// to view order details
exports.orderDetails = async(req,res) => {
    let order = await Order.findById(req.params.id).populate('user','username')
    .populate({path:'orderItemIds',populate:{path:'product',populate:('category')}})
    if(!order){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(order)
}

// to view orders of a user
exports.userOrders = async(req, res) => {
    let order = await Order.find({user: req.params.userid})
    .populate({path:'orderItemIds',populate:{path:'product',populate:('category')}})
    if(!order){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(order)
}

// to update status
exports.updateOrder = async(req,res) => {
    let order = await Order.findByIdAndUpdate(req.params.orderId,{
        status: req.body.status
    },
    {new:true})
    if(!order){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(order)
}

// to delete order
exports.deleteOrder = (req,res) => {
    Order.findByIdAndRemove(req.params.order_id)
    .then(async order=>{
        if(order){
            await order.orderItemIds.map(async orderItem => 
                await OrderItem.findByIdAndRemove(orderItem))
                return res.status(200).json({message: "Order deleted successfully"})
        }
        else{
            return res.status(400).json({error:"Order not found"})
        }
    })
    .catch(err=>{
        return res.status(400).json({error:err})
    })
}
        
        
        
        
        



// orderItems - samsung - 3, apple - 1, nokia - 5
// orderItem - samsung, 3 , id1
// orderItemIds - id1
// orderItem - apple, 1 , id2
// orderItemIds - id1 , id2
// orderItem - nokia, 5 , id3
// orderItemIds - id1 , id2, id3

// individualTotalPrice - [10000*3, 100000*1, 5000*5]