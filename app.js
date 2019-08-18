const express = require('express')
const request = require("request");
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


//configs
const port = 29

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {

	Zagros.GetFlights('MHD','THR','','', function(result)
	{
	});

})

app.get('/soon', function (req, res) {
  res.render('main.ejs');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
