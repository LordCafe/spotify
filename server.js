let express = require("express");
let hbs = require("express-handlebars"); 
let app = express();
let port = 3000;
app.engine('.hbs', hbs({ extname:'.hbs'}));
app.set('view engine','.hbs');

app.get('/',(req,res)=>{
 	res.render('home')
});


app.listen(port ,()=>{
	console.log( " listen the port "+ port )
});