// exports.showInfo=((req,res)=>{
// res.send("This message is from controller")
// })

const Category = require('../models/categoryModel')

exports.addCategory = async(request,response) => {
    Category.findOne({category_name:request.body.category_name},async (error,category)=>{
        if(category){
            return response.status(400).json({error:"category already exists."})
        }
        else{
            let cat = new Category({
                category_name:request.body.category_name})
            cat = await cat.save()
            if(!cat){
                return response.status(400).json({error:"something went wrong"})
            }
            else{
                response.send(cat)
            }
        }
    })

}

// to get all categories
exports.getAllCategories = async(req,res) =>{
    let cat =await Category.find()
    if(!cat){
        return res.status(400).json({error:"something went wrong"})
    }
    else{
        res.send(cat)
    }
}

// to find particular category
exports.findCategory = async(req,res)=>{
    let cat = await Category.findById(req.params.id)
    if(!cat){
        return res.status(400).json({error:"something went wrong"})
    }
    else{
        res.send(cat)
    }
}

// to update category
exports.updateCategory = async(req,res)=>{
    let cat = await Category.findByIdAndUpdate(
        req.params.id,
        {
            category_name:req.body.category_name
        },
        {new:true}
    )
    if(!cat){
        return res.status(400).json({error:"something went wrong"})
    }
    else{
        res.send(cat)
    }
}

// to delete/remove a category
exports.deleteCategory = (req,res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(category=>{
        if(!category){
            return res.status(400).json({error:"Category not found"})
        }
        else{
            return res.status(200).json({
                message:"Category deleted successfully"
            })
        }
    })
    .catch(err=>res.status(400).json({error:err}))
}