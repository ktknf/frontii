var request = require('request');

//Modules
var utility = require("./utility.js");

module.exports = {

  //GetFlights Function
  GetFlights: function(Source, Target, Date, Adult, callback) {
    var get_url = "http://Zv.nirasoftware.com:882/AvailabilityFareJS.jsp?Airline=ZV&cbSource=" +
      Source + "&cbTarget=" + Target +
      "&cbDay1=28&cbMonth1=5&cbAdultQty=1&cbChildQt=0&InfantQty=0&OfficeUser=THR210-1.WS&OfficePass=K2019";
    request.get(get_url, function(err, res, body) {
          var flght = JSON.parse(body)['AvailableFlights'];
          for(var i=0; i<flght.lenght;i++)
          {
            console.log(flght[0].ClassesStatus);
          }
          callback(body);
    });
  },
  //GetFlight Function End

//Reserve Function Start
  Reserve: function(Source,Target,FlightClass,No,Day,Month,Name,Last,Age,ID,FlightNo,Contact,callback) {
    var get_url = "http://book.zagrosairlines.com/cgi-bin/NRSWeb.cgi/ReservJS?Airline=ZV"
    +"&cbSource="+Source+"&cbTarget="+Target+"&FlightClass="+FlightClass+"&No="+No+"&Day="
    +Day+"&Month="+Month+"&edtName1="+Name+"&edtLast1="+Last+"&edtAge1="+Age+"&edtID1="
    +ID+"&OfficeUser=THR210-1.WS&OfficePass=K2019&edtContact="+Contact+"&FlightNo="+FlightNo;

    request.get(get_url, function(err, res, body) {

          callback(body);
    });
  }
  //Reserve Fuvnction End
};
