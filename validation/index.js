const { check, validationResult } = require('express-validator')

exports.categoryRules = [
    check('category_name', 'category name is required').notEmpty()
    .isLength({min:3}).withMessage('Category name must be at least 3 characters')
]

exports.productRules =[
   
    check('product_price', 'price is required').notEmpty()
    .isNumeric().withMessage('price must be a number'),
    check('product_name','product name is required').notEmpty(),
    check('product_description', 'description is required').notEmpty()
    .isLength({min:20}).withMessage('description must be at least 20 characters'),
    check('count_in_stock','count in stock is required').notEmpty()
    .isNumeric().withMessage('count must be only numbers'),
    check('category','category is required').notEmpty(),
    check('product_image','image is required').notEmpty()
   
]

exports.validation = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        next()
    }
    else {
        return res.status(400).json({ error: errors.array()[0].msg })
    }
}



//module.exports = validation

//middleware
// app.use('/api',CategoryRoute)
// app.use('/api',ProductRoute)
// /->localhost:5000
