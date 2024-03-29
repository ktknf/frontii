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


var Iconv = require('iconv').Iconv;
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

function comparePrice(a, b) {
  if (a.IntPrice < b.IntPrice) {
    return -1;
  }
  if (a.IntPrice > b.IntPrice) {
    return 1;
  }
  return 0;
}

function comparePriceReverse(a, b) {
  if (a.IntPrice > b.IntPrice) {
    return -1;
  }
  if (a.IntPrice < b.IntPrice) {
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

  if (req.body.airline === 'ZV') {
    Zagros.Reserve(req.body.from, req.body.to, req.body.classname, 1, req.body.day, req.body.month,
      req.body.edtname, req.body.edtlast, age_value, req.body.edtid, req.body.fnumber, '1111111',
      function(reserve_result) {
        //var data={flights:all_flights,today:Utility.GetNowJalali(),par:req.query};
        console.log(reserve_result);
        var invoice_id = Math.floor(Math.random() * 1000).toString() + req.body.edtid.substring(3, 7) + '0';
        Insertor.insert_one('Invoice', ['InvoiceID', 'Type', 'Estate', 'PNR', 'Email'], [invoice_id, 'zagros', 'new', reserve_result['PNR'], req.body.email], function(insert_result) {
          var price_value = req.body.price;
          //var price_value=req.body.price;
          var red = "https://sep.shaparak.ir/payment.aspx?Amount=" + price_value + "0&ResNum=" + invoice_id + "&MerchantCode=" + reserve_result['PNR'] + "&RedirectURL=http://kouhenour.ir:3389/payres&MID=11593879";
          console.log(red);
          if (reserve_result['PNR'] === '') {
            res.send('خطایی در رزرو بلیط شما رخ داده است. لطفا مجددا تلاش کنید یا کلاس پروازی دیگری انتخاب کنید.');
          } else {
            res.redirect(red);
          }

        });
        //res.render('flight_results.ejs',data);
      });
  }

  if (req.body.airline === 'IV') {
    Caspian.Reserve(req.body.from, req.body.to, req.body.classname, 1, req.body.day, req.body.month,
      req.body.edtname, req.body.edtlast, age_value, req.body.edtid, req.body.fnumber, '1111111',
      function(reserve_result) {
        //var data={flights:all_flights,today:Utility.GetNowJalali(),par:req.query};
        console.log(reserve_result);
        var invoice_id = Math.floor(Math.random() * 1000).toString() + req.body.edtid.substring(3, 7) + '1';
        Insertor.insert_one('Invoice', ['InvoiceID', 'Type', 'Estate', 'PNR', 'Email'], [invoice_id, 'caspian', 'new', reserve_result['PNR'], req.body.email], function(insert_result) {
          var price_value = req.body.price;
          //var price_value=req.body.price;
          var red = "https://sep.shaparak.ir/payment.aspx?Amount=" + price_value + "0&ResNum=" + invoice_id + "&MerchantCode=" + reserve_result['PNR'] + "&RedirectURL=http://kouhenour.ir:3389/payres&MID=11593879";
          console.log(red);
          if (reserve_result['PNR'] === '') {
            res.send('خطایی در رزرو بلیط شما رخ داده است. لطفا مجددا تلاش کنید یا کلاس پروازی دیگری انتخاب کنید.');
          } else {
            res.redirect(red);
          }
        });
        //res.render('flight_results.ejs',data);
      });
  }

})



app.post('/iatires', function(req, res) {

  var age_value = 33;

  Iati.Reserve(req.body.from, req.body.to, req.body.classname, 1, req.body.day, req.body.month,
    req.body.edtname, req.body.edtlast,req.body.faname, req.body.falast, age_value, req.body.edtid, req.body.fnumber, '1111111',req.body.email,
    req.body.flightid, req.body.searchid, req.body.sessid,
    function(reserve_result) {
      reserve_result = JSON.parse(reserve_result);
      console.log("$$$$$$$$$$$$$$");
      console.log(reserve_result);
      console.log("$$$$$$$$$$$$$$");
      console.log(reserve_result["Message"]);

      var red = "https://sep.shaparak.ir/payment.aspx?Amount=1000" + "&ResNum=" + reserve_result["PaymentCode"] + "&MerchantCode=123456" + "&RedirectURL=" + "http://kouhenour.ir:3389/payresiati?sessid=" + req.body.sessid + "&MID=11593879";
      console.log(red);
      if (reserve_result["Message"] === 'An error has occurred.') {
        res.send('خطایی در رزرو بلیط شما رخ داده است. لطفا مجددا تلاش کنید یا کلاس پروازی دیگری انتخاب کنید.');
      } else {
        res.redirect(red);
      }


    });

})

//Iati Flights List
app.get('/interflight', function(req, res) {

console.log("???????"+req.query.date+"||||"+req.query.date2);
  var final_array = [];
  var final_array_returns = [];

  Iati.GetFlights(req.query.from, req.query.to, Utility.DateToGeorg(Utility.ToEnglishDigits(req.query.date)) , Utility.DateToGeorg(Utility.ToEnglishDigits(req.query.date2)) , req.query.iroundtrip, req.query.adult, req.query.child, req.query.infant, function(iv_all_flights) {
    final_array = final_array.concat(iv_all_flights.flight);
    final_array_returns = final_array_returns.concat(iv_all_flights.return);

    var data = {
      flights: final_array,
      returns:final_array_returns,
      today: Utility.GetNowJalali(),
      par: req.query
    };
    console.log(data);
    if(req.query.iroundtrip==='true')
      {
        res.render('iati_results_round.ejs', data);
      }
    else
      {
        res.render('iati_results.ejs', data);
      }

  });

})
//End of Iati Flights List


app.get('/flight', function(req, res) {

  var day_value = req.query.date.split('-')[2];
  var month_value = req.query.date.split('-')[1];
  var final_array = [];

  var dayx = (parseInt(day_value) - 3);
  var monthx = (parseInt(Utility.ToEnglishDigits(month_value)) + 3).toString();

  console.log("************" + dayx + "*********" + monthx);
  Mahan.GetFlights(req.query.from, req.query.to, Utility.ToEnglishDigits(day_value) - 9, monthx, 1, 0, 0, function(mv_all_flights) {
    final_array = final_array.concat(mv_all_flights);

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

      if (req.query.sort === "pricereverse") {
        final_array = final_array.sort(comparePriceReverse);
      } else {
        final_array = final_array.sort(comparePrice);
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
  Search.GetBest('THR', 'MHD', function(best) {
    Search.GetBest('THR', 'BUZ', function(best) {
      Search.GetBest('THR', 'KIH', function(best) {
        Search.GetBest('THR', 'AZD', function(best) {
          Search.GetBest('THR', 'ABD', function(best) {

            console.log(best);
          });
        })
      });
    })
  });
})


app.get('/cronmhd', function(req, res) {
  Search.GetBest('MHD', 'IFN', function(best) {
    Search.GetBest('MHD', 'THR', function(best) {
      Search.GetBest('MHD', 'SYZ', function(best) {
        Search.GetBest('MHD', 'AZD', function(best) {
          Search.GetBest('MHD', 'ABD', function(best) {

            console.log(best);
          });
        })
      });
    })
  });
})


app.get('/cronifn', function(req, res) {
  Search.GetBest('IFN', 'MHD', function(best) {
    Search.GetBest('IFN', 'AWZ', function(best) {
      Search.GetBest('IFN', 'KIH', function(best) {
        Search.GetBest('IFN', 'PGU', function(best) {
          Search.GetBest('MHD', 'ABD', function(best) {

            console.log(best);
          });
        })
      });
    })
  });
})

app.get('/soon', function(req, res) {
  res.render('main.ejs');
})


app.get('/mmm', function(req, res) {
  res.send('just find an other developer!!!!');
})

app.post('/payresiati', function(req, res) {
  if (req.body.State === 'OK') {
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log(req.body.ResNum);
    var get_url = "http://kouhenour.ir:8400/vmoney?sess=" + req.query.sessid + "&payid=" + req.body.ResNum;
    console.log(get_url);
    request.get(get_url, function(err, reso, body) {
      var get_url = "http://kouhenour.ir:8400/selllist?sess=" + req.query.sessid + "&payid=" + req.body.ResNum;
      console.log(body);

      console.log(get_url);
      request.get(get_url, function(err, reso, body) {
        var bookarray=JSON.parse(body)[0].BookingArray;
        console.log(typeof bookarray);
        var send_to_front = {"data":JSON.parse(bookarray)};
        console.log("$$$$$$$$$$$$$$$$$$ SENT TO FRONT $$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(send_to_front);
        res.render("iatiticket.ejs", send_to_front);
      });
    });
  } else {
    console.log(req.body);
  }
})


//Payment Result
app.post('/payres', function(req, res) {
  if (req.body.State === 'OK') {
    console.log(req.body);

    if (req.body.ResNum[req.body.ResNum.length - 1] === '0') {
      Selector.select_all_where('Invoice', 'InvoiceID=' + req.body.ResNum, function(select_result) {
        console.log(select_result[0]);
        Zagros.Issue(select_result[0].PNR, select_result[0].Email, function(issue_result) {
          if (issue_result === 'err') {
            res.send("خطایی در صدور بلیت رخ داده است. هزینه پرداختی شما ظرف 72 ساعت به حساب شما بازگردانده میشود.");
          }
          Zagros.Etr(issue_result, function(etr_result) {
            console.log(etr_result);
            var send_to_front = JSON.parse(etr_result);
            res.render("ticket.ejs", send_to_front);
          });
          console.log(issue_result);
        });
      });
    }

    if (req.body.ResNum[req.body.ResNum.length - 1] === '1') {
      Selector.select_all_where('Invoice', 'InvoiceID=' + req.body.ResNum, function(select_result) {
        console.log(select_result[0]);
        Caspian.Issue(select_result[0].PNR, select_result[0].Email, function(issue_result) {
          if (issue_result === 'err') {
            res.send("خطایی در صدور بلیت رخ داده است. هزینه پرداختی شما ظرف 72 ساعت به حساب شما بازگردانده میشود.");
          }
          Caspian.Etr(issue_result, function(etr_result) {
            console.log(etr_result);
            var send_to_front = JSON.parse(etr_result);
            res.render("ticket.ejs", send_to_front);
          });
          console.log(issue_result);
        });
      });
    }

  } else {
    console.log(req.body);
  }
})
//End of Payment Result


app.get('/test_any', function(req, res) {
  Iati.GetFlights("IKA", "DXB", "03", "09", 1, 0, 0, function(iv_all_flights) {
    console.log(iv_all_flights);
    res.send(iv_all_flights);
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
