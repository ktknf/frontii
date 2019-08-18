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
          var flght = JSON.parse(body);
          console.log(flght);
          callback(body);
    });
  },
  //GetFlight Function End

  ToPersianDigits: function() {
    return "Hola";
  }
};
