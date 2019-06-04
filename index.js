const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var users = new Array();
var properties = new Array();
var bookingRequests = new Array();

//creating new users
app.post("/users", (req, res) => {
    const user = req.body;
    const bodyFirstName = user.firstname;
    const bodyLastName = user.lastname;
    const bodyEmail = user.email;
    const bodyPassword = user.password;

    if (!bodyFirstName) {
        return res.status(400).json({ message: "Invalid first name" });
    }

    if (!bodyLastName) {
        return res.status(400).json({ message: "Invalid last name" });
    }

    if (!bodyEmail) {
        return res.status(400).json({ message: "Invalid email" });
    }

    if (!bodyPassword) {
        return res.status(400).json({ message: "invalid password" });
    }

    let foundUser = null;
    users.forEach(aUser => {
        if (bodyEmail === aUser.email) {
            founderUser = aUser;
        }
    });

    if (foundUser != null) {
        return res.status(400).json({ message: "Email already in use" });
    }

    //if email is unique, and all fields are filled:
    var newUser = {
        id: users.length + 1,
        firstname: bodyFirstName,
        lastname: bodyLastName,
        email: bodyEmail,
        password: bodyPassword
    }
    users.push(newUser);

    //return the new user with details:
    res.json(newUser);

});

//logging in
app.post("/users/authentication", (req, res) => {
    const user = req.body;
    const bodyEmail = user.email;
    const bodyPassword = user.password;

    //checking if email field is blank
    if (!bodyEmail) {
        return res.status(400).json({ message: "Invalid email" });
    }

    //checking if password field is blank
    if (!bodyPassword) {
        return res.status(400).json({ message: "Please enter a password" })
    }


    //checking if email matches email in database
    //then checking if password matches
    users.forEach(aUser => {
        if (bodyEmail === aUser.email) {
            if (bodyPassword === aUser.password) {
                //how to combine??
                res.send("Login successful; found user!");
                res.send(aUser.email);
            }
            else {
                return res.status(400).json({ message: "Wrong password" });
            }
        }
    })

});

//create a new property
app.post("/properties", (req, res) => {
    const property = req.body;

    const bodyName = property.name;
    const bodyLocation = property.location;
    const bodyImageUrl = property.imageUrl;
    const bodyPrice = property.price;

    if (!bodyName) {
        return res.status(400).json({ message: "Please name your property." });
    }

    if (!bodyLocation) {
        return res.status(400).json({ message: "Please list property's location." });
    }

    if (!bodyImageUrl) {
        return res.status(400).json({ message: "Please include an image URL." });
    }

    if (!bodyPrice) {
        return res.status(400).json({ message: "Please include your property's price." });
    }

    //checking if property is already listed using image URL.
    //potentially a better way?
    let foundProperty = null;
    properties.forEach(aProperty => {
        if (bodyImageUrl === aProperty.imageUrl) {
            foundProperty = aProperty;
        }
    });

    if (foundProperty != null) {
        return res.status(400).json({ message: "Image already in use - this listing already exists." });
    }

    var newProperty = {
        id: properties.length + 1,
        name: bodyName,
        location: bodyLocation,
        imageUrl: bodyImageUrl,
        price: bodyPrice

    }

    properties.push(newProperty);

    //return new property with details.
    res.json(newProperty);
});

//delete a property
app.delete("/properties/:id", (req, res) => {
    const propertyId = req.params.id;

    if (!propertyId) {
        return res.status(400).json({ message: "Please include a property ID." });
    }

    for (var k = 0; k < properties.length; k++) {
        const aProperty = properties[k];
        if (aProperty.id == propertyId) {
            //delete listing
            properties.splice(k, 1);

            //adjust id's?

            return res.status(200).json({ message: "Property successfully deleted." });
        }
    }

    return res.status(404).json({ message: "Property not found" });
});

//get property by id
app.get("/properties/:id", (req, res) => {
    const propertyId = req.params.id;

    if (!propertyId) {
        return res.status(400).json({ message: "Please include a property ID." });
    }

    for (var k = 0; k < properties.length; k++) {
        const aProperty = properties[k];
        if (aProperty.id == propertyId) {
            return res.status(200).json(aProperty);

        }
    }

    return res.status(400).json({ message: "Property not found." });

})

//creating booking requests
app.post("/properties/:id/bookings", (req, res) => {
    const propertyId = req.params.id;

    const bookingReq = req.body;

    //pulling from user request
    //as of now, dates are just integers
    const startDate = bookingReq.dateFrom;
    const endDate = bookingReq.dateTo;
    const usersId = bookingReq.userID;

    if (!propertyId) {
        return res.status(400).json({ message: "Please include a property ID." });
    }

    //why set as "new"? then first booking will be "new" instead of "accepted"
    let status = "ACCEPTED";
    for (var k = 0; k < bookingRequests.length; k++) {
        const aBooking = bookingRequests[k];
        if (bookingReq.dateFrom >= aBooking.dateFrom && bookingReq.dateFrom <= aBooking.dateTo) {
            status = "REJECTED";
        }
        else if (bookingReq.dateTo >= aBooking.dateFrom && bookingReq.dateTo <= aBooking.dateTo) {
            status = "REJECTED";
        }
        else {
            status = "ACCEPTED";
        }
    }


    var newBookingReq = {
        id: bookingRequests.length + 1,
        dateFrom: startDate,
        dateTo: endDate,
        userId: usersId,
        propId: propertyId,
        bookingStatus: status
    }

    bookingRequests.push(newBookingReq);
    res.json(newBookingReq);
});

//finding booking requests for a given property
app.get("/properties/:id/bookings", (req,res) => {
    propertyBookings = new Array();
    const propertyId = req.params.id;

    if (!propertyId) {
        return res.status(400).json({ message: "Please include a property ID." });
    }

    for (var k = 0; k < bookingRequests.length; k++) {
        const aBooking = bookingRequests[k];
        if(aBooking.id = propertyId) {
            propertyBookings.push(aBooking);
        }
    }

    res.json(propertyBookings);
})

app.listen(4000, () => console.log("Server is running."));