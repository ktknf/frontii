var request = require('request');

//Modules
var utility = require("./utility.js");

module.exports = {

  //GetFlights Function
  GetFlights: function(Source, Target, Day, Month, Adult, Child, Infant, callback) {
    var get_url = "http://iv.nirasoftware.com:882/AvailabilityJS.jsp?Airline=IV&cbSource=" +
      Source + "&cbTarget=" + Target + "&cbDay1=" + Day + "&cbMonth1=" + Month + "&cbAdultQty=" + Adult +
      "&cbChildQt=" + Child + "&InfantQty=" + Infant + "&OfficeUser=THR752.ws&OfficePass=ko2018h";
    console.log(get_url);

    request.get(get_url, function(err, res, body) {
      var flght = JSON.parse(body)['AvailableFlights'];
      var final_return = [];
      for (var i = 0; i < flght.length; i++) {
        //console.log(flght[i]);
        var adp=flght[i]['AdultTotalPrices'].split(' ');
        var sts=flght[i]['ClassesStatus'].replace('/','').split(' ');

        var availClaess=[];

        for (var k =0; k<sts.length; k++)
        {
          if(sts[k][sts[k].length-1]!=='C' && sts[k][sts[k].length-1]!=='X')
          {
            availClaess.push(sts[k].slice(0, -1));
          }
        }

        console.log("avail:   ");
        console.log(availClaess);
        for (var j = 0; j < adp.length; j++) {

          var class_val=adp[j].split(':')[0];
          var price_val=adp[j].split(':')[1];
          price_val=price_val/10;

          if (availClaess.indexOf(class_val) != -1) {
            final_return.push({
              AirLine: 'کاسپین',
              AirLineShort: 'IV',
              TimeClass: utility.TimeClass(flght[i]['DepartureDateTime']),
              DepartureDateTime: utility.ToShamsi(flght[i]['DepartureDateTime']),
              ArrivalDateTime: utility.ToShamsi(flght[i]['ArrivalDateTime']),
              From: flght[i]['Origin'],
              FullFrom: flght[i]['Origin'],
              To: flght[i]['Destination'],
              FullTo: flght[i]['Destination'],
              Price: utility.CommaSeprate(price_val),
              IntPrice: parseInt(price_val),
              FlightNo: flght[i]['FlightNo'],
              Class: class_val,
              Spec: flght[i]['Origin'] + "-" + flght[i]['Destination'] + "-" + flght[i]['FlightNo'] + "-" + class_val + "-" + Day + "-" + Month + "-" + price_val + "-IV"
            });
          }
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
    var get_url = "http://iv.nirasoftware.com:880/cgi-bin/NRSWeb.cgi/ReservJS?Airline=IV" +
      "&cbSource=" + Source + "&cbTarget=" + Target + "&FlightClass=" + FlightClass + "&No=" + No + "&Day=" +
      Day + "&Month=" + Month + "&edtName1=" + Name + "&edtLast1=" + Last + "&edtAge1=" + Age + "&edtID1=" +
      ID + "&OfficeUser=THR752.ws&OfficePass=ko2018h&edtContact=" + Contact + "&FlightNo=" + FlightNo;

    console.log(get_url);
    request.get(get_url, function(err, res, body) {
      callback(JSON.parse(body)['AirReserve'][0]);
    });
  },
  //Reserve Fuvnction End


  //Issue Function Start
  Issue: function(PNR, Email, callback) {
    var get_url = "http://iv.nirasoftware.com:880/cgi-bin/NRSWeb.cgi/ETIssueJS?Airline=IV" +
      "&PNR=" + PNR + "&Email=" + Email + "&OfficeUser=THR752.ws&OfficePass=ko2018h";

    console.log(get_url);
    request.get(get_url, {
      timeout: 150000
    }, function(err, res, body) {

      body = body.replace(/(\r\n|\n|\r)/gm, "");
      var rs = JSON.parse(body);
      console.log(rs["AirNRSTICKETS"][0]["Tickets"].split('=')[1]);
      var ticket_num = rs["AirNRSTICKETS"][0]["Tickets"].split('=')[1];

      try {
        callback(ticket_num);
      } catch (e) {
        callback('err');
        console.log(e);
        console.log(body);
      }
    });
  },
  //Issue Fuvnction End

  //ETR Function Start
  Etr: function(TicketNo, callback) {
    var get_url = "http://iv.nirasoftware.com:882/NRSETR.jsp?Airline=IV" +
      "&TicketNo=" + TicketNo + "&OfficeUser=THR752.ws&OfficePass=ko2018h";

    console.log(get_url);
    request.get(get_url, {
      timeout: 150000
    }, function(err, res, body) {
      console.log(body);

      try {
        callback(body);
      } catch (e) {
        callback('err');
        console.log(e);
        console.log(body);
      }
    });
  },
  //ETR Fuvnction End

  //CancelSeat Function Start
  CancelSeat: function(PNR, Name, Last, Date, FlightNo, callback) {
    var get_url = "http://iv.nirasoftware.com:882/cgi-bin/NRSWeb.cgi/CancelSeatJS?Airline=IV" +
      "&PNR=" + PNR + "&PassengerName=" + Name + "&PassengerLastName=" + Last + "&DepartureDate=" + Date +
      "&FlightNo=" + FlightNo + "&OfficeUser=THR752.ws&OfficePass=ko2018h";

    console.log(get_url);
    request.get(get_url, function(err, res, body) {
      callback(body);
    }).setTimeout(600000);
  }
  //CancelSeat Fuvnction End

};
