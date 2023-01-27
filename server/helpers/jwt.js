const  expressjwt = require('express-jwt');


function authJwt(){
	const secret=process.env.SECRET
	const api=process.env.api
	return expressjwt({
		secret,
		algorithms:['HS256']
	}).unless({
		path:[
			{url:/\/api\/v1\/products(.*)/,methods:['GET','OPTIONS']},
			{url:/\/api\/v1\/categories(.*)/,methods:['GET','OPTIONS']},
			`${api}/users/login`,
			`${api}/users/register`
		]
	})

}

module.exports=authJwt;