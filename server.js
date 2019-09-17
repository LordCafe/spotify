let express = require("express");
let app = express();
let cors = require('cors');
let cookieParser = require('cookie-parser');

let hbs = require('./hbsHelpers');
let snapSpotify = require('./snapSpotify')
hbs(app, __dirname);
let port = 3000;


app.use(express.static('public'))
.use(cors())
.use(cookieParser());

snapSpotify(app);

app.get('/',(req,res)=>{
 	res.render('home',{
 		layout:'login',
 		helpers:{
 			title : 'login'
 		}
 	})
});

app.get('/profile',(req,res)=>{
 	res.render('profile',{
 		helpers:{
 			title : 'profile'
 		}
 	})
});





app.get('/login',(req,res)=>{
 	res.render('login',{
 		layout:'login',
 		helpers:{
 			title : 'login'
 		}
 	})
});
app.listen(port ,()=>{
	console.log( " listen the port "+ port )
});