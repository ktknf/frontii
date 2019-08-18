const express = require('express')
const request = require("request");
const bodyParser = require("body-parser");
const sendmail = require('sendmail')();
var fs = require('fs');
var path = require('path');
var dir = path.join(__dirname, 'public');
const app = express()
var cookieParser = require('cookie-parser');
var session = require('express-session');
var formidable = require('formidable');
var mysql      = require('mysql');
var md5 = require('md5');

//Modules
var Zagros = require("./Zagros.js");
var Selector = require("./Selector.js");
var Utility = require("./utility.js");

//configs
const port = 29

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
	Selector.select_all('Tour',function(all_tour){
		res.render('main.ejs',{tours:all_tour,today:Utility.GetNowJalali()});
	});
})

app.get('/soon', function (req, res) {
  res.render('main.ejs');
})

//Payment Result
app.post('/payres', function (req, res) {
	if(req.body.State==='OK')
	{
		console.log(req.body);
	}
})
//End of Payment Result

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
