var request = require('request');

//Modules
var utility = require("./utility.js");

module.exports = {

  //GetFlights Function
  GetFlights: function(Source, Target, Day, Month, Adult, Child, Infant, callback) {
    var get_url = "http://Zv.nirasoftware.com:882/AvailabilityFareJS.jsp?Airline=ZV&cbSource=" +
      Source + "&cbTarget=" + Target + "&cbDay1=" + Day + "&cbMonth1=" + Month + "&cbAdultQty=" + Adult +
      "&cbChildQt=" + Child + "&InfantQty=" + Infant + "&OfficeUser=THR210-1.WS&OfficePass=K2019";

      var headers = {
          'cookie': 'somecookie',
          'origin': 'https://foo.bar',
          'accept-encoding': 'gzip, deflate, br',
          'accept-language': 'en-US,en;q=0.9,pt;q=0.8',
          'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
          'content-type': 'application/json; charset=UTF-8',
          'accept': '*/*',
          'referer': 'https://foo.bar/path',
          'authority': 'www.foo.bar',
          'x-requested-with': 'XMLHttpRequest'
      };

    var options = {
      uri: 'http://testapi.iati.ir/Tracker/Get_LoginID/7D7764DF874F8C9D06B7A5BAA462AD0F',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
      },
      body: '{"MemberID": null,"ClientIPAddress": "95.217.5.6"}'
    };

    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {

        var what=decodeURIComponent(body);
        console.log(what) // Print the shortened url.
      }
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
