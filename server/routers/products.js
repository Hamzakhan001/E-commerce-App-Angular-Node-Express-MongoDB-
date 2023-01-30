const express=require('express')
const router=express.Router()
const {Product}=require('../models/Product')
const { Category } = require('../models/Category')
const mongoose=require('mongoose')
const multer=require('multer')


const FILE_TYPE_MAP={
	'image/png':'png',
	'image/jpeg':'jpeg',
	'image/jpg':'jpg'
}


let storage=multer.diskStorage({
	destination:function(req,file,cb){
		const isValid=FILE_TYPE_MAP[file.mimetype]
		let uploadError=new Error("Invalid File type!")

		if(isValid){
			uploadError=null
		}
		cb(uploadError,'public/uploads')
	},

	filename:function(req,file,cb){
		const fileName=file.originalname.split(' ').join('-');
		
		// const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1E9)
		cb(null,`${fileName}-${Date.now()}.${extenion}`)
	}
})

const uploadOptions=multer({storage:storage})


router.get('/',(req,res)=>{
	let filter={}
	if(req.query.categories){
		 filter={category:req.query.categories.split(',')}
	}
	const productList=Product.find({category:filter}).populate('category')
	console.log("hello",productList)
	if(!productList){
		console.log("hello",productList)
		res.status(500).send({success:false})
	}
	res.send(productList)
})


router.get('/:id',(req,res)=>{
    const productt=Product.findById(req.params.id).populate('category')
	if(!product){
		res.status(500).json({success:false})
	}
	res.send(product)
})

router.post('/',uploadOptions.single('image'),async (req,res)=>{
	const category=await Category.findById(req.body.Category)
	if(!category){
		res.status(400).send("Invalid Category!")
	}
	const fileName=req.file.filename
	const basePath=`${req.protocol}://${req.get('host')}/public/upload/`

	if(!fileName){
		return res.status(500).send("No image in request!")

	}
	const product=new Product({
		name:req.body.name,
		description:req.body.description,
		richDescription:req.body.richDescription,
		image:`${basePath}${fileName}`,
		branch:req.body.branch,
		price:req.body.price,
		category:req.body.category,
		rating:req.body.rating,
		numReviews:req.body.numReviews,
		isFeatured:req.body.isFeatured,
		countInStock:req.body.countInStock,
	})
	product=await product.save()
	if(!product){
		res.status(500).send('Product cannot be created!')
	}
	res.status(200).json(createdProduct)
	product.save().then((createdProduct)=>{
		res.status(200).json(createdProduct)
	}).catch((err)=>{
		res.status(500).json({
			error:err,
			success:false
		})
	})
})

router.put('/:id',async (req,res)=>{
	if(!mongoose.isValidObjectId(req.params.id)){
		req.status(400).send('Invalid Product!')
	}
	const category=await Category.findById(req.body.Category)
	if(!category){
		res.status(400).send("Invalid Category!")
	}
	const singleProduct=await Product.find()
	if(!singleProduct){
		res.status(400).send("Product not found!")
	}

	const file=req.file;
	if(file){
		const filename=file.filename;
		const basePath=`${req.protocol}://${req.get('host')}/public/uploads/`;
		const imagePath=`${basePath}${filename}`
	}
	else{
		imagePath=singleProduct.images
	}

    const product=await Product.findByIdAndUpdate(
		req.params.id,
		{
		name:req.body.name,
		description:req.body.description,
		richDescription:req.body.richDescription,
		image:req.body.image,
		branch:req.body.branch,
		price:req.body.price,
		category:req.body.category,
		rating:req.body.rating,
		numReviews:req.body.numReviews,
		isFeatured:req.body.isFeatured,
		countInStock:req.body.countInStock,
		},
		{new:true}
		)
	category=await category.save()
	if(!category){
		return res.status(500).send("The Product cannot be found!")
	}
	res.status(200).send(category)
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

router.put('/gallery-images/:id',uploadOptions.array('images',20),async (req,res)=>{
	if(!mongoose.isValidObjectId(req.params.id)){
		req.status(400).send('Invalid Product!')
	}
	const files=req.files 
	let imagesPaths=[]
	const basePath=`${req.protocol}://${req.get('host')}/public/upload/`
	if(files){
		files.map((elem)=>{
			imagesPaths.push(`${basePath}${elem.filename}`)
			imagesPaths.push(elem.filename)
		})
	}
    const product=await  Product.findByIdAndUpdate(
		req.params.id,
		{
		
		},
		{new:true}
		)
	category=await category.save()
	if(!category){
		return res.status(500).send("The Product cannot be found!")
	}
	res.status(200).send(category)

})

module.exports=router;