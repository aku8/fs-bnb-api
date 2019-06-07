var mysqlConn = require("../../db");

//creating user in database
var User = function(user) {
    this.name = user.firstname;
    this.surname = user.lastname;
    this.role = user.role;
    this.email = user.email;
    this.password = user.password;
}
 module.exports = User; 

User.createUser = function(newUser, result) {
    mysqlConn.query("INSERT INTO user set ?", newUser, function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res.insertId);
        result(null, res.insertId);
      }
    });
  };

//get all users
User.getAllUsers = function(result) {
    mysqlConn.query("Select * from user", function(err,res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else {
            console.log("Users : ", res);
            result(null, res);
        }
    });
};