var request = require('request');

var Zagros = require("./Zagros.js");
var Caspian = require("./Caspian.js");
var Mahan = require("./Mahan.js");
var Iati = require("./Iati.js");

//Modules
var Utility = require("./utility.js");
var Insertor = require("./Insertor.js");
var Updater = require("./Updater.js");

module.exports = {


  //GwtBest Function Start
  GetBest: function(Source, Target , callback) {

    Dt=Utility.GetNowJalali();
    var day_value = Dt.split('-')[2];
    var month_value = Dt.split('-')[1];
    var final_array = [];
    Caspian.GetFlights(Source, Target, Utility.NextDay(Utility.ToEnglishDigits(day_value)), Utility.ToEnglishDigits(month_value), 1, 0, 0, function(iv_all_flights_) {
      final_array = final_array.concat(iv_all_flights_);
    Zagros.GetFlights(Source, Target,Utility.NextDay(Utility.ToEnglishDigits(day_value)), Utility.ToEnglishDigits(month_value), 1, 0, 0, function(all_flights_) {
      final_array = final_array.concat(all_flights_);
    Zagros.GetFlights(Source, Target, Utility.ToEnglishDigits(day_value), Utility.ToEnglishDigits(month_value), 1, 0, 0, function(all_flights) {
      final_array = final_array.concat(all_flights);

      Caspian.GetFlights(Source, Target, Utility.ToEnglishDigits(day_value), Utility.ToEnglishDigits(month_value), 1, 0, 0, function(iv_all_flights) {
        final_array = final_array.concat(iv_all_flights);
          var lowest = Number.POSITIVE_INFINITY;
          var highest = Number.NEGATIVE_INFINITY;
          var tmp;
          for (var i=final_array.length-1; i>=0; i--) {
              tmp = final_array[i].IntPrice;
              if (tmp < lowest) lowest = tmp;
              if (tmp > highest) highest = tmp;
          }
          Updater.update_where('BestCost',['Cost'],[lowest],"Title='"+Source+Target+"'", function(rs){
            callback(lowest)
          });
      });
    });
  });
});

  }
  //GwtBest Fuvnction End



};
