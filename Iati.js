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
    const spawn = require('child_process').spawn;
    const ls = spawn('python', ['x.py', Source, Target , "2019-"+Month+"-"+Day]);

    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
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
