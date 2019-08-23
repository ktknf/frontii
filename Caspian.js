var request = require('request');

//Modules
var utility = require("./utility.js");

module.exports = {

  //GetFlights Function
  GetFlights: function(Source, Target, Day, Month, Adult, Child, Infant, callback) {
    var get_url = "http://iv.nirasoftware.com:882/AvailabilityFareJS.jsp?Airline=IV&cbSource=" +
      Source + "&cbTarget=" + Target + "&cbDay1=" + Day + "&cbMonth1=" + Month + "&cbAdultQty=" + Adult +
      "&cbChildQt=" + Child + "&InfantQty=" + Infant + "&OfficeUser=THR752.ws&OfficePass=ko2018h";
    console.log(get_url);

    request.get(get_url, function(err, res, body) {
      var flght = JSON.parse(body)['AvailableFlights'];
      var final_return = [];
      for (var i = 0; i < flght.length; i++) {
        //console.log(flght[i]);
        for (var j = 0; j < flght[i]['ClassesStatus'].length; j++) {
          final_return.push({
            AirLine:'کاسپین',
            AirLineShort:'IV',
            TimeClass:utility.TimeClass(flght[i]['DepartureDateTime']),
            DepartureDateTime:utility.ToShamsi(flght[i]['DepartureDateTime']),
            ArrivalDateTime:utility.ToShamsi(flght[i]['ArrivalDateTime']),
            From:flght[i]['Origin'],
            FullFrom:flght[i]['Origin'],
            To:flght[i]['Destination'],
            FullTo:flght[i]['Destination'],
            Price:flght[i]['ClassesStatus'][j]['Price'],
            FlightNo:flght[i]['FlightNo'],
            Class:flght[i]['ClassesStatus'][j]['FlightClass'],
            Spec:flght[i]['Origin']+"-"+flght[i]['Destination']+"-"+flght[i]['FlightNo']+"-"+flght[i]['ClassesStatus'][j]['FlightClass']+"-"+Day+"-"+Month+"-"+flght[i]['ClassesStatus'][j]['Price']
          });
        }
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
      "&PNR=" + PNR + "&Email=" + Email+ "&OfficeUser=THR210-1.WS&OfficePass=K2019";

      console.log(get_url);
    request.get(get_url, {timeout: 150000}, function(err, res, body) {

      try {
        callback(body);
      }
      catch (e) {
        callback('err');
        console.log(e);
        console.log(body);
      }
    });
  },
  //Issue Fuvnction End


  //CancelSeat Function Start
  CancelSeat: function(PNR,Name,Last,Date,FlightNo, callback) {
    var get_url = "http://Book.zagrosairlines.com/cgi-bin/NRSWeb.cgi/CancelSeatJS?Airline=ZV" +
      "&PNR=" + PNR + "&PassengerName=" + Name+ "&PassengerLastName=" + Last+"&DepartureDate=" + Date+
      "&FlightNo=" + FlightNo + "&OfficeUser=THR210-1.WS&OfficePass=K2019";

      console.log(get_url);
    request.get(get_url, function(err, res, body) {
      callback(body);
    }).setTimeout(600000);
  }
  //CancelSeat Fuvnction End

};