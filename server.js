let express = require("express");
let app = express();
let hbs = require('./hbsHelpers');
hbs(app, __dirname);
let port = 3000;
app.use(express.static('public'));

app.get('/',(req,res)=>{
 	res.render('home',{
 		helpers:{
 			title : 'home'
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