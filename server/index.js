const express=require('express')
const app=express();
const morgan=require('morgan')
require('dotenv/config')
const authJwt=require('./helpers/jwt')
const errorHandler=require('./helpers/error-handlers')

  

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt())
app.use(errorHandler)
app.use('/public/uploads',express.static(__dirname+'/public/uploads'));
const mongoose=require('mongoose')
const cors=require('cors')
const api=process.env.API_URL

app.use(cors());
app.options('*',cors())

const productsRouter=require('./routers/products')
const categoriesRouter=require('./routers/categories')
const usersRouter=require('./routers/users')
const ordersRouter=require('./routers/orders')


app.use(`${api}/products`,productsRouter)
app.use(`${api}/categories`,categoriesRouter)
app.use(`${api}/users`,usersRouter)
app.use(`${api}/orders`,ordersRouter)


mongoose.connect(process.env.DB_CONNECTION_STRING)
.then(()=>{
	console.log("DB connected")
})
.catch((err)=>{
	console.error(err)
})


app.listen('2000',()=>{
	console.log('server started on port 3000')

})