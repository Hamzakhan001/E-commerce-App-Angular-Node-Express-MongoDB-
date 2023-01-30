const express=require('express')
const router=express.Router()
const {Order}=require('../models/Order')
const { OrderItem } = require('../models/order-item')



router.get('/',async (req,res)=>{
	const orderList=await Order.find().populate('user','name').sort({'dateOrdered':-1});

	if(!orderList){
		return res.status(500).send("No orders!")
	}
	res.status(200).json(orderList)
}) 

router.get('/:id',async (req,res)=>{
	const orderList=await Order.findById(req.params.id).
	populate('user','name').
	populate({path:'orderItems',
	populate:{path:'product',
	populate:'category'}}) 
	if(!orderList){
		return res.status(500).send("No orders!")
	}
	res.status(200).json(orderList)
}) 


router.post('/',async (req,res)=>{
	const orderItemsIds=Promise.all(req.body.orderItems.map(async (orderitem)=>{
		let newItem=new OrderItem({
			quantity:orderitem.quantity,
			product:orderitem.product
		})
		newOrderItem= await newItem.save()
		return newOrderItem._id;
	}))
	const orderItemsIdResolved=await orderItemsIds;
	console.log(orderItemsIdResolved)

	const totalPrices=await  Promise.all(orderItemsIdResolved.map(async (orderItem)=>{
		 orderItem=await OrderItem.findById(orderItem).populate('product','price')
		const totalPrice=orderItem.product.price * orderItem.quantity;
		return totalPrice
	}))

	console.log(totalPrices)
	const totalPrice=totalPrices.reduce((a,b)=>a+b,0)

    const order=new Order({
		orderItems:orderItemsIdResolved,
		shippingAddress1:req.body.shippingAddress1,
		shippingAddress2:req.body.shippingAddress2,
		city:req.body.city,
		country:req.body.country,
		status:req.body.status,
		totalPrice:req.body.totalPrice,
		user:req.body.user,
		dateOrdered:req.body.dateOrdered
	})
	order=await order.save()
	if(!order){
		return res.status(404).send("The Order cannot be created!")
	}

	res.status(200).send(order)
})

router.get('/get/totalSales',async (req,res)=>{
	const totalSales=await Order.aggregate([
		{$group:{_id:null,totalsales:{$sum:'$totalPrice'}}}
	])
	if(!totalSales){
		res.status(400).send("The sales couldnot be genereate!")
	}
	res.send({totalSales:totalSales.pop().totalSales})
})

router.get('/get/count',async (req,res)=>{
	const orderCount=await Order.countDocuments((count)=>count)

	if(!orderCount){
		res.status(500).json({success:false})
	}
	res.send({orderCount:orderCount})

})

router.get('/get/userorders/:userid',async (req,res)=>{

	const userOrderList=await Order.find({user:req.params.userid}).populate({
		path:'orderItems',populate:{
			path:'product',populate:'category'
		}
	}).sort({'dateOrdered':-1})

	if(!userOrderList){
		res.status(500).json({success:false})

	}

	res.status(200).send(userOrderList)

})

router.put('/:id',async (req,res)=>{
	Order.findByIdAndRemove(req.params.id).then(async (order)=>{
		if(order){
			await order.orderItems.map(async orderItem =>{
				await OrderItem.findByIdAndRemove(orderItem)
			})
			return res.status(200).json({success:true,message:"The Order is deleted"})
		}
		else{
			return res.status(404).json({success:false,message:"Order Not Found"})
		}
	}).catch(err=>{
		return res.status(500).json({success:false,error:err})
	})
})

router.delete('/:id',async(req,res)=>{
	let order=Order.findByIdAndDelete(req.params.id)
	if(!order){
		res.status(404).send("Order not found!")
	}
	res.status(200).send("Order has been deleted!")
})


module.exports=router