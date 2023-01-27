const express=require('express')
const router=express.Router()
const {User}=require('../models/Product')
const { Category } = require('../models/Category')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')



router.get('/',async (req,res)=>{
	const usersList=await User.find().select('-passwordHash')
	if(!usersList){
		res.status(500).json({success:false})
	}
	res.send(usersList)
}) 

router.get('/:id',(req,res)=>{
    const user=User.findById(req.params.id).select('-passwordHash')
	if(!user){
		res.status(500).json({success:false})
	}
	res.send(user)
})

router.post('/',async (req,res)=>{

	const user=new User({
		name:req.body.name,
		email:req.body.email,
		passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
		phone:req.body.phone,
		isAdmin:req.body.isAdmin,
		street:req.body.street,
		appartment:req.body.appartment,
		description:req.body.description,
		zip:req.body.zip,
		city:req.body.city,
		country:req.body.country,
	})
	user=await product.save()
	if(!user){
		res.status(500).send('User cannot be created!')
	}
	res.status(200).json(user)
	// res.status(200).json(user)
	// product.save().then((createdProduct)=>{
	// 	res.status(200).json(createdProduct)
	// }).catch((err)=>{
	// 	res.status(500).json({
	// 		error:err,
	// 		success:false
	// 	})
	// })
})

router.put('/:id',async (req,res)=>{
	const userExist=await User.findById(req.params.id)
	if(!userExist){
		return res.status(500).status("User is not found")
	}
	let passwordUpdate;
	if(req.body.passwordHash){
		passwordUpdate=bcrypt.hashSync(req.body.passwordHash,10)
	}
	else{
		passwordUpdate=userExist.passwordHash;
	}

    const user=await User.findByIdAndUpdate(
		 req.params.id,
		{name:req.body.name,
		email:req.body.email,
		passwordHash:passwordUpdate,
		phone:req.body.phone,
		isAdmin:req.body.isAdmin,
		street:req.body.street,
		appartment:req.body.appartment,
		description:req.body.description,
		zip:req.body.zip,
		city:req.body.city,
		country:req.body.country,
	    },{new:true}
		)
		user=await user.save()
	if(!user){
		return res.status(500).send("The User cannot be found!")
	}
	res.status(200).send(user)
})

router.delete('/:id',async(req,res)=>{
	let product=Product.findByIdAndDelete(req.params.id)
	if(!product){
		res.status(404).send("Product not found!")
	}
	res.status(200).send("Product  has been deleted!")
})

router.get('/get/count',async (req,res)=>{
    const productCount=await Product.countDocuments((count)=>count)
	if(!productCount){
		res.status(500).json({success:false})
	}
	res.send({count:productCount})
})

router.get('/get/featured/:count',async (req,res)=>{ 
	const count=req.params.count? req.params.count :0
    const productFeatured=await Product.find({isFeatured:true}).limit(+count);
	if(!productFeatured){
		res.status(500).json({success:false})
	}
	res.send({featuredProducts:productFeatured})
})

module.exports=router;