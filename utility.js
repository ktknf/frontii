var moment = require('moment-jalaali')

var persian = Array('۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹');
var english = Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
var month_before = Array('/۰۱/', '/۰۲/', '/۰۳/', '/۰۴/', '/۰۵/', '/۰۶/', '/۰۷/', '/۰۸/', '/۰۹/','/۱۰/','/۱۱/','/۱۲/');
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
    var val=moment().format('jYYYY-jMM-jDD')+' ';
    for(var i=0;i<10;i++)
    {
      val=val.replace(new RegExp(english[i], 'g'),persian[i]);
    }
    return val.trim();
  },

  ToEnglishDigits: function(str) {
    var val=str+' ';
    for(var i=0;i<10;i++)
    {
      val=val.replace(persian[i],english[i]);
    }
    return val.trim();
  },
  ToShamsi: function(datetime) {
    var date=datetime.split(' ')[0];
    var time=datetime.split(' ')[1];
    m = moment(date, 'YYYY-M-D');
    m.locale('fa').format('YYYY/MM/DD');
    var ret=m.locale('fa').format('jYYYY/jMM/jDD')+" "+time;

    for(var i=0;i<12;i++)
    {
      ret=ret.replace(month_before[i],month[i]);
    }

    return ret;
  },

  TimeClass: function(datetime) {
    var time=parseInt(datetime.split(' ')[1].split(':'[0]));
    if(time<10)
    {
      return "morning";
    }

    if(time<14)
    {
      return "noon";
    }

    if(time<20)
    {
      return "evening";
    }


      return "night";

  },

  ToPersianDigits: function() {
    //TODO
    return "Hola";
  },

  NextDay: function(day) {
    //TODO
    var nxt=parseInt(day)+1;
    return nxt.toString();
  },



  CommaSeprate: function(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

};
