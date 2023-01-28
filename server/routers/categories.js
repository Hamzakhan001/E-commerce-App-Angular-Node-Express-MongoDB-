const express=require('express')
const router=express.Router()
const {Category}=require('../models/Category')



router.get('/',async (req,res)=>{
	const categoryList=await Category.find();
	if(!categoryList){
		res.status(500).json({success:false})
	}
	res.send(categoryList)
})

router.get('/:id',async (req,res)=>{
	const category=await Category.find(req.params.id);
	if(!category){
		res.status(500).send("Category not found!")
	}
	res.send(category)
})

router.post('/',async (req,res)=>{
    const category=new Category({
		name:req.body.name,
		icon:req.body.icon,
		color:req.body.color
	})
	category=await category.save()
	if(!category){
		return res.status(404).send("The Category cannot be created!")
	}

	res.status(200).send(category)
})

router.put('/:id',async (req,res)=>{
    const category=Category.findByIdAndUpdate(
		req.params.id,
		{
			name:req.body.name,
			icon:req.body.icon,
			color:req.body.color
		},
		{new:true}
		)
	// category=await category.save()
	if(!category){
		return res.status(404).send("The Category cannot be found!")
	}
	res.status(200).send(category)
})

router.delete('/:id',async(req,res)=>{
	let category=Category.findByIdAndDelete(req.params.id)
	if(!category){
		res.status(404).send("Category not found!")
	}
	res.status(200).send("Category has been deleted!")
})

module.exports=router;