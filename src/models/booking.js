var mysqlConn = require("../../db");

//creating booking in database
var Booking = function(booking) {
    this.user = booking.userId;
    this.property = listing.propertyId;
    this.start = listing.startDate;
    this.end = listing.endDate;
}
module.exports = Booking; 

Booking.createBooking = function(newBooking, result) {
    mysqlConn.query("INSERT INTO booking set ?", newBooking, function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res.insertId);
        result(null, res.insertId);
      }
    });
  };