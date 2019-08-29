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
var mysql = require('mysql');
var md5 = require('md5');


var Iconv  = require('iconv').Iconv;
var iconv = new Iconv('UTF-8', 'ISO-8859-1');

const utf8 = require('utf8');

//Modules
var Zagros = require("./Zagros.js");
var Caspian = require("./Caspian.js");
var Mahan = require("./Mahan.js");
var Iati = require("./Iati.js");
var Selector = require("./Selector.js");
var Search = require("./Search.js");
var Utility = require("./utility.js");
var Insertor = require("./Insertor.js");

//configs
const port = 3389;

function comparePrice( a, b ) {
  if ( a.IntPrice < b.IntPrice ){
    return -1;
  }
  if ( a.IntPrice > b.IntPrice ){
    return 1;
  }
  return 0;
}

function comparePriceReverse( a, b ) {
  if ( a.IntPrice > b.IntPrice ){
    return -1;
  }
  if ( a.IntPrice < b.IntPrice ){
    return 1;
  }
  return 0;
}


app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, 'public')))

app.post('/zvreserve', function(req, res) {

  var age_value = 33;

  Zagros.Reserve(req.body.from, req.body.to, req.body.classname, 1, req.body.day, req.body.month,
    req.body.edtname, req.body.edtlast, age_value, req.body.edtid, req.body.fnumber, '1111111',
    function(reserve_result) {
      //var data={flights:all_flights,today:Utility.GetNowJalali(),par:req.query};
      console.log(reserve_result);
      var invoice_id = Math.floor(Math.random() * 1000).toString() + req.body.edtid.substring(3, 7);
      Insertor.insert_one('Invoice', ['InvoiceID', 'Type', 'Estate', 'PNR', 'Email'], [invoice_id, 'zagros', 'new', reserve_result['PNR'], req.body.email], function(insert_result) {
        var price_value = 1000;
        //var price_value=req.body.price;
        var red = "https://sep.shaparak.ir/payment.aspx?Amount=" + price_value + "&ResNum=" + invoice_id + "&MerchantCode=" + reserve_result['PNR'] + "&RedirectURL=http://kouhenour.ir:29/payres&MID=11593879";
        console.log(red);
        res.redirect(red);

      });
      //res.render('flight_results.ejs',data);
    });

})

app.get('/flight', function(req, res) {

      var day_value = req.query.date.split('-')[2];
      var month_value = req.query.date.split('-')[1];
      var final_array = [];
      Zagros.GetFlights(req.query.from, req.query.to, Utility.ToEnglishDigits(day_value), Utility.ToEnglishDigits(month_value), req.query.adult, 0, 0, function(all_flights) {
        final_array = final_array.concat(all_flights);

        Caspian.GetFlights(req.query.from, req.query.to, Utility.ToEnglishDigits(day_value), Utility.ToEnglishDigits(month_value), req.query.adult, 0, 0, function(iv_all_flights) {
          final_array = final_array.concat(iv_all_flights);

          var data = {
            flights: final_array,
            today: Utility.GetNowJalali(),
            par: req.query
          };
          console.log(data);
          res.render('flight_results.ejs', data);
        });
      });
})

app.get('/sortedflight', function(req, res) {

      var day_value = req.query.date.split('-')[2];
      var month_value = req.query.date.split('-')[1];
      var final_array = [];
      Zagros.GetFlights(req.query.from, req.query.to, Utility.ToEnglishDigits(day_value), Utility.ToEnglishDigits(month_value), req.query.adult, 0, 0, function(all_flights) {
        final_array = final_array.concat(all_flights);

        Caspian.GetFlights(req.query.from, req.query.to, Utility.ToEnglishDigits(day_value), Utility.ToEnglishDigits(month_value), req.query.adult, 0, 0, function(iv_all_flights) {
          final_array = final_array.concat(iv_all_flights);

          if(req.query.sort==="pricereverse")
          {
            final_array=final_array.sort(comparePriceReverse);
          }
          else
          {
            final_array=final_array.sort(comparePrice);
          }

          var data = {
            flights: final_array,
            today: Utility.GetNowJalali(),
            par: req.query
          };
          console.log(data);
          res.render('flight_results.ejs', data);
        });
      });
})

app.get('/', function(req, res) {
  Selector.select_all('Tour', function(all_tour) {
    Selector.select_all('BestCost', function(all_best) {
      var bests = {};
      for (var i = 0; i < all_best.length; i++) {
        bests[all_best[i]['Title']] = all_best[i]['Cost'];
      }

      var data = {
        bests: bests,
        tours: all_tour,
        today: Utility.GetNowJalali()
      };


      console.log(data);
      res.render('main.ejs', data);
    });
  });
})

app.get('/cron', function(req, res) {
    Search.GetBest('THR','MHD',function(best){
    console.log(best);
  });
})

app.get('/soon', function(req, res) {
  res.render('main.ejs');
})

//Payment Result
app.post('/payres', function(req, res) {
  if (req.body.State === 'OK') {
    console.log(req.body);
    Selector.select_all_where('Invoice', 'InvoiceID=' + req.body.ResNum, function(select_result) {
      console.log(select_result[0]);
      Zagros.Issue(select_result[0].PNR, select_result[0].Email, function(issue_result) {
				if(issue_result==='err')
				{
					res.send("خطایی در صدور بلیت رخ داده است. هزینه پرداختی شما ظرف 72 ساعت به حساب شما بازگردانده میشود.");
				}
				res.send("رزرو با موفقیت انجام شد . پست الکترونیک خود را چک کنید.");

        console.log(issue_result);
      });
    });
  }
})
//End of Payment Result


app.get('/test_any', function(req, res) {

  Iati.GetFlights("THR","MHD","24","8", 1, 0, 0, function(ccc)
 {
   //res.charset('utf-8');
    res.send(ccc);
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
