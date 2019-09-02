var request = require('request');
var zlib = require("zlib");
let {
  PythonShell
} = require('python-shell')
//Modules
var utility = require("./utility.js");

module.exports = {

  //GetFlights Function
  GetFlights: function(Source, Target, Day, Month, Adult, Child, Infant, callback) {
    var get_url = "http://kouhenour.ir:8400/?from="+Source+"&to="+Target+"&date=2019-"+Month+"-"+Day;
    console.log(get_url);

    request.get(get_url, function(err, res, body) {
      var flght = JSON.parse(body);
      var final_return = [];
      for (var i = 0; i < flght.length; i++) {
        //console.log(flght[i]);
          final_return.push({
            AirLine:flght[i]['Legs'][0]['OperatorName'],
            AirLineShort:flght[i]['Legs'][0]['OperatorCode'],
            TimeClass:'noon',
            DepartureDateTime:flght[i]['Legs'][0]['DepartureTime'],
            ArrivalDateTime:flght[i]['Legs'][0]['ArrivalTime'],
            From:Source,
            FullFrom:Source,
            To:Target,
            FullTo:Target,
            Price:utility.CommaSeprate(10000000),
            IntPrice:parseInt(1000000),
            FlightNo:flght[i]['Legs'][0]['FlightNo'],
            Class:'x',
            Spec:Source+"-"+Target+"-"+flght[i]['Legs']['FlightNo']+"-"+"X"+"-"+Day+"-"+Month+"-"+"100000"+"-IV"
          });
        }

      console.log("total caspain: ");
      console.log(final_return.length);
      callback(final_return);
    });
  },
  //GetFlight Function End

  //Reserve Function Start
  Reserve: function(Source, Target, FlightClass, No, Day, Month, Name, Last, Age, ID, FlightNo, Contact, callback) {
    var get_url = "http://book.zagrosairlines.com/cgi-bin/NRSWeb.cgi/ReservJS?Airline=ZV" +
      "&cbSource=" + Source + "&cbTarget=" + Target + "&FlightClass=" + FlightClass + "&No=" + No + "&Day=" +
      Day + "&Month=" + Month + "&edtName1=" + Name + "&edtLast1=" + Last + "&edtAge1=" + Age + "&edtID1=" +
      ID + "&OfficeUser=THR210-1.WS&OfficePass=K2019&edtContact=" + Contact + "&FlightNo=" + FlightNo;

    console.log(get_url);
    request.get(get_url, function(err, res, body) {
      callback(JSON.parse(body)['AirReserve'][0]);
    });
  },
  //Reserve Fuvnction End


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
