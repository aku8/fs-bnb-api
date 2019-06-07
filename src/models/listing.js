var mysqlConn = require("../../db");

//creating listing in database
var Listing = function(listing) {
    this.name = listing.name;
    this.location= listing.location;
    this.imageUrl = listing.imageUrl;
    this.price = listing.price;
    this.providerId = listing.providerId;
}
module.exports = Listing; 

Listing.createListing = function(newListing, result) {
    mysqlConn.query("INSERT INTO listing set ?", newListing, function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res.insertId);
        result(null, res.insertId);
      }
    });
  };

