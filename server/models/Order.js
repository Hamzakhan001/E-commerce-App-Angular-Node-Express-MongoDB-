const mongoose=require('mongoose')

const OrdersSchema=mongoose.Schema({
	orderItems:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:'OrderItem',
		required:true
	}],
	shippingAddress1:{
		type:String,
		required:true
	},
	shippingAddress2:{
		type:String,
	},
	city:{
		type:String,
		required:true
	},
	country:{
		type:String,
		required:true
	},
	status:{
		type:String,
		required:true,
		default:'Pending'
	},
	totalPrice:{
		type:Number,
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:'User',
	},
	
	dateOrdered:{
		type:Date,
		default:Date.now()
	}
})

OrdersSchema.virtual('id').get(function(){
	return this._id.toHexString();
})

OrdersSchema.set('toJSON',{
	virtuals:true
})

exports.Order=mongoose.model('Order',OrdersSchema)
