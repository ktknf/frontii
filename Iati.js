var request = require('request');
var zlib = require("zlib");
var moment = require('moment-jalaali');
let {
  PythonShell
} = require('python-shell')
//Modules
var utility = require("./utility.js");

var month_before = Array('/۰۱/', '/۰۲/', '/۰۳/', '/۰۴/', '/۰۵/', '/۰۶/', '/۰۷/', '/۰۸/', '/۰۹/', '/۱۰/', '/۱۱/', '/۱۲/');
var month = Array(' فروردین ',
  ' اردیبهشت ',
  ' خرداد ',
  ' تیر ',
  ' مرداد ',
  ' شهریور ',
  ' مهر ',
  ' آبان ',
  ' آذر ',
  ' دی ',
  ' بهمن ',
  ' اسفند ');

module.exports = {

  //GetFlights Function
  GetFlights: function(Source, Target, Day, Month, Adult, Child, Infant, callback) {
    var get_url = "http://kouhenour.ir:8400/?from=" + Source + "&to=" + Target + "&date=2019-" + Month + "-" + Day+"&adult=1&child=0&infant=0";
    console.log("_______________________________________");
    console.log(get_url);

    request.get(get_url, function(err, res, body) {
      var flght = JSON.parse(body);
      var final_return = [];
      for (var i = 0; i < flght.length; i++) {

        var dtime = flght[i]['Legs'][0]['DepartureTime'];
        var final_dtime = dtime.split(' ')[0];

        m = moment(final_dtime, 'YYYY-M-D');
        m.locale('fa').format('YYYY/MM/DD');
        var dret = m.locale('fa').format('jDD/jMM/jYYYY') + "   " + dtime.split(' ')[1] + ":00";

        for (var j = 0; j < 12; j++) {
          dret = dret.replace(month_before[j], month[j]);
        }


        var atime = flght[i]['Legs'][0]['ArrivalTime'];
        var final_atime = atime.split(' ')[0];

        m = moment(final_atime, 'YYYY-M-D');
        m.locale('fa').format('YYYY/MM/DD');
        var aret = m.locale('fa').format('jDD/jMM/jYYYY') + "   " + atime.split(' ')[1] + ":00";

        for (var j = 0; j < 12; j++) {
          aret = aret.replace(month_before[j], month[j]);
        }


        //console.log(flght[i]['Legs'][0]['Baseprice']);
        var prstr = Math.floor(flght[i]['Baseprice'] / 10000) * 1000;

        //console.log(flght[i]);
        final_return.push({
          AirLine: flght[i]['Legs'][0]['OperatorName'],
          AirLineShort: flght[i]['Legs'][0]['OperatorCode'],
          TimeClass: 'noon',
          DepartureDateTime: dret,
          ArrivalDateTime: aret,
          From: Source,
          FullFrom: Source,
          To: Target,
          FullTo: Target,
          Price: utility.CommaSeprate(prstr),
          IntPrice: parseInt(flght[i]['Baseprice']),
          FlightNo: flght[i]['Legs'][0]['FlightNo'],
          Class: 'x',
          Spec: Source + "#" + Target + "#" + flght[i]['Legs']['FlightNo'] + "#" + "X" + "#" + Day + "#" + Month + "#" + "100000" + "#IV#" + flght[i]['SearchID'] + "#" + flght[i]['FlightID'] + "#" + flght[i]['SessID']
        });
      }

      console.log("total caspain: ");
      console.log(final_return.length);
      callback(final_return);
    });
  },
  //GetFlight Function End

  //Reserve Function Start
  Reserve: function(Source, Target, FlightClass, No, Day, Month, Name, Last, FaName,FaLast, Age, ID, FlightNo, Contact,Email, FlightID, SearchID, SessID, callback) {

    var get_url = "http://kouhenour.ir:8400/pricedetail?search=" + SearchID + "&sess=" + SessID + "&adult=" + No + "&flight=" + FlightID;
    console.log(get_url);
    request.get(get_url, function(err, res, body) {
      var pricedetail_val=JSON.parse(body)["PriceDetialID"];
      var get_url = "http://kouhenour.ir:8400/payid?sess=" + SessID;
      console.log(get_url);
      request.get(get_url, function(err, res, body) {
        var payment_val=JSON.parse(body)["PaymentCode"];
        var get_url = "http://kouhenour.ir:8400/addticket?sess=" + SessID + "&detailid=" + pricedetail_val + "&name=" + FaName + "&last=" + FaLast +
         "&enname=" + Name + "&enlast=" + Last+"&email=" + Email+"&id=" + ID+"&payid="+payment_val;
        console.log(get_url);
        request.get(get_url, function(err, res, body) {
          callback(body);
        });
      });
    });
  },
  //Reserve Function End


  //Issue Function Start
  Issue: function(PNR, Email, callback) {
    var get_url = "http://Book.zagrosairlines.com/cgi-bin/NRSWeb.cgi/ETIssueJS?Airline=ZV" +
      "&PNR=" + PNR + "&Email=" + Email + "&OfficeUser=THR210-1.WS&OfficePass=K2019";

    console.log(get_url);
    request.get(get_url, {
      timeout: 150000
    }, function(err, res, body) {

      try {
        callback(body);
      } catch (e) {
        callback('err');
        console.log(e);
        console.log(body);
      }
    });
  },
  //Issue Fuvnction End


  //CancelSeat Function Start
  CancelSeat: function(PNR, Name, Last, Date, FlightNo, callback) {
    var get_url = "http://Book.zagrosairlines.com/cgi-bin/NRSWeb.cgi/CancelSeatJS?Airline=ZV" +
      "&PNR=" + PNR + "&PassengerName=" + Name + "&PassengerLastName=" + Last + "&DepartureDate=" + Date +
      "&FlightNo=" + FlightNo + "&OfficeUser=THR210-1.WS&OfficePass=K2019";

    console.log(get_url);
    request.get(get_url, function(err, res, body) {
      callback(body);
    }).setTimeout(600000);
  }
  //CancelSeat Fuvnction End

};
