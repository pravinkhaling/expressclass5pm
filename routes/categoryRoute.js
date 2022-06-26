const express = require('express')
const router = express.Router()
const {addCategory, getAllCategories, findCategory, updateCategory, deleteCategory} = require('../controllers/categoryController')
const { requireSignin } = require('../controllers/userController')
// const validation = require('../validation')
const { categoryRules, validation } = require('../validation')


router.post('/addcategory',requireSignin, categoryRules, validation,addCategory)
router.get('/categories',getAllCategories)
router.get('/findcategory/:id',findCategory)
router.put('/category/update/:id',updateCategory)
router.delete('/deletecategory/:id',deleteCategory)


module.exports = router