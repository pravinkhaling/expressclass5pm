const express = require('express')
const { addProduct, viewproducts, product_details, update_product, delete_product, filterProduct } = require('../controllers/productController')
const {upload}= require('../utils/fileUpload')
const { validation, productRules} =require('../validation')
const router = express.Router()
const {requireSignin} =require('../controllers/userController')

router.post('/addproduct',productRules,upload.single('product_image'),validation,requireSignin,addProduct)
router.get('/products',viewproducts)
router.get('/product/details/:id',product_details)
router.put('/product/update/:id', update_product)
router.delete('/product/delete/:id',delete_product)
router.post('/filterproduct',filterProduct)


module.exports=router
