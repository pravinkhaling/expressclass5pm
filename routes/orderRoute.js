const express = require ('express')
const router =  express.Router()
const {placeOrder, orders, orderDetails, userOrders} = require('../controllers/orderController')


router.post('/placeorder', placeOrder)
router.get('/orders',orders)
router.get('/orderdetails/:id',orderDetails)
router.get('/userOrders/:userid', userOrders)
router.get('/orderdetails/:id',orderDetails)

module.exports = router
