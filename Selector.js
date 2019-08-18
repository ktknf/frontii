var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2bacvvy',
  database: 'cms'
});


module.exports = {
  select_all: function(table, callback) {
    connection.connect();
    var query='SELECT * FROM '+table+';';
    console.log(query);
    connection.query(query , function(error, results, fields) {
      if (error) throw error;
      callback(results);
    });

    connection.end();
  },

  select_all_where: function(table, where, callback) {
    connection.connect();

    connection.query('SELECT * FROM '+table+' WHERE '+ where + ';' , function(error, results, fields) {
      if (error) throw error;
      callback(results);
    });

    connection.end();
  },

  ToShamsi: function() {
    return "HELLO";
  },

  ToPersianDigits: function() {
    return "Hola";
  }
};
