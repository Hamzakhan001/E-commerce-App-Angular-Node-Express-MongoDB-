const express=require('express')
const app=express();
const morgan=require('morgan')
require('dotenv/config')
  

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
const mongoose=require('mongoose')
const cors=require('cors')

const api=process.env.API_URL

app.use(cors());
app.options('*',cors())

const productsRouter=require('./routers/products')
const categoriesRouter=require('./routers/products')
const usersRouter=require('./routers/products')
const ordersRouter=require('./routers/products')


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


app.listen('6000',()=>{
	console.log('server started on port 3000')

})