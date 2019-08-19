var moment = require('moment-jalaali')

var persian = Array('۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹');

function convertToPersianNumber(value) {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  let confidentValue = value;
  for (var i = 0; i < value.length; i++) {
    const inArabicIndex = arabicNumbers.indexOf(value[i]);
    if (inArabicIndex > -1) {
    confidentValue = confidentValue.replace(
      value[i],
      englishNumbers[inArabicIndex]
    );
  }

  const inPersianIndex = persianNumbers.indexOf(value[i]);
  if (inPersianIndex > -1) {
      confidentValue = confidentValue.replace(
        value[i],
        englishNumbers[inPersianIndex]
      );
    }
  }
  return confidentValue;
}

var FullName = {
  'MHD': 'مشهد',
  'THR': 'تهران'
};

module.exports = {
  ReplaceDigits:function(str) {

     for(i=0;i<10;i++){

        var regex=eval("/"+i+"/g");

        str.replace(regex,persian[i]);

     }

     return str;
  },

  GetFullName: function(short) {
    return FullName[short];
  },

  GetNowJalali: function() {
    var val=moment().format('jYYYY-jM-jD');
    for(var i=0;i<10;i++)
    {
      val=val.replace(i,persian[i]);
    }
    return val;
  },


  ToShamsi: function() {
    //TODO
    return "HELLO";
  },

  ToPersianDigits: function() {
    //TODO
    return "Hola";
  }
};
