var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2bacvvy',
  database: 'cms'
});
connection.connect();


module.exports = {
  select_all: function(table, callback) {
    var query='SELECT * FROM '+table+';';
    console.log(query);
    connection.query(query , function(error, results, fields) {
      if (error) throw error;
      callback(results);
    });

  },

  select_all_where: function(table, where, callback) {

    var query='SELECT * FROM '+table+' WHERE '+ where + ';';
    console.log(query);

    connection.query(query , function(error, results, fields) {
      if (error) throw error;
      callback(results);
    });

  },

  ToShamsi: function() {
    return "HELLO";
  },

  ToPersianDigits: function() {
    return "Hola";
  }
};
