var mysqlConn = require("../../db");

var Provider = function(provider) {
    this.name = provider.firstname;
    this.surname = provider.lastname;
    this.email = user.email;
    this.password = user.password;
}
 module.exports = Provider; 

 Provider.createProvider = function(newProvider, result) {
    mysqlConn.query("INSERT INTO provider set ?", newProvider, function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res.insertId);
        result(null, res.insertId);
      }
    });
  };