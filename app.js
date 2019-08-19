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

app.get('/zvreserve', function (req, res) {

	var day_value=req.query.date.split('-')[2];
	var month_value=req.query.date.split('-')[1];

	Zagros.Reserve(req.body.from,req.query.to,Utility.ToEnglishDigits(day_value),Utility.ToEnglishDigits(month_value),req.query.adult,0,0,function(all_flights){
		var data={flights:all_flights,today:Utility.GetNowJalali(),par:req.query};
		console.log(data);
		res.render('flight_results.ejs',data);
	});

})

app.get('/flight', function (req, res) {

	var day_value=req.query.date.split('-')[2];
	var month_value=req.query.date.split('-')[1];

	Zagros.GetFlights(req.query.from,req.query.to,Utility.ToEnglishDigits(day_value),Utility.ToEnglishDigits(month_value),req.query.adult,0,0,function(all_flights){
		var data={flights:all_flights,today:Utility.GetNowJalali(),par:req.query};
		console.log(data);
		res.render('flight_results.ejs',data);
	});

})

app.get('/', function (req, res) {
	Selector.select_all('Tour',function(all_tour){
		var data={tours:all_tour,today:Utility.GetNowJalali()};
		console.log(data);
		res.render('main.ejs',data);
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
