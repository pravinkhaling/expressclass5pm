const Product = require('../models/productModel')

// to add new product
exports.addProduct = async (req, res) => {
    let products = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        product_image: req.file.path,
        category: req.body.category,
        count_in_stock: req.body.count_in_stock
    })
    products = await products.save()
    if (!products) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(products)
    }
}

// to view product list
exports.viewproducts = async (req, res) => {
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let order = req.query.order ? req.query.order : '1'
    let limit = req.query.limit ? Number(req.query.limit) : 200000

    let product = await Product.find().populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to view product details
exports.product_details = async (req, res) => {
    let product = await Product.findById(req.params.id).populate('category')
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to update product
exports.update_product = async (req, res) => {
    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            product_name: req.body.product_name,
            product_price: req.body.product_price,
            product_description: req.body.product_description,
            product_image: req.file.path,
            category: req.body.category
        },
        { new: true }
    )
    if (!product) {
        return res.status(400).json({ error: "something went wrong" })
    }
    else {
        res.send(product)
    }
}

// to delete product
exports.delete_product = (req, res) => {
    Product.findByIdAndDelete(req.params.id, (error, product) => {
        if (error) {
            return res.status(400).json({ error: error })
        }
        if (!product) {
            return res.status(400).json({ error: "product not found" })
        }
        else {
            return res.status(200).json({ message: "product removed successfully" })
        }

    })
}

// to get filtered products
exports.filterProduct = async (req, res) => {
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let order = req.query.order ? req.query.order : '1'
    let limit = req.query.limit ? Number(req.query.limit) : 20000000
    let skip = req.query.skip ? Number(req.query.skip) : 0
    // filter arguments
    let findArgs = {}
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === ' product_price') {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }
            else {
                findArgs[key] = req.body.filters[key]
            }
        }
    }
    // find products
    const product = await Product.find(findArgs)
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .skip(skip)
    if (!product) {
        return res.status(400).json({
            error: "something went wrong"
        })
    }
    res.json({
        size: product.length,
        product
    })
}