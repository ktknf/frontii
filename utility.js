var FullName = {
  'MHD': 'مشهد',
  'THR': 'تهران'
};

module.exports = {

  GetFullName: function(short) {
    return FullName[short];
  },

  ToShamsi: function() {
    return "HELLO";
  },

  ToPersianDigits: function() {
    return "Hola";
  }
};
