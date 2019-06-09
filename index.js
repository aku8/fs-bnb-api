const express = require("express");
const cors = require('cors');
const mysql = require('mysql');

//details of mySql database
const config = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "fs_bnb"
};
const connection = mysql.createConnection(config);
connection.connect();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const User = require("./src/models/users");
const Provider = require("./src/models/providers");

const Listing = require("./src/models/listing")


//creating new users
app.post("/users", (req, res) => {
    const user = req.body;
    console.log(user);

    connection.query("INSERT INTO user SET ?", user, (err, result) => {
        if (err) {
            console.log(err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: err.sqlMessage });
            } else {
                return res.status(500).json({ message: "Failed to insert. Please try again." });
            }
        }

        console.log(result);

        var responseUser = {
            id: result.insertId,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: user.password
        };

        return res.status(200).json(responseUser);

    });
    // res.json("Yay!");
});

//get all users
app.get("/users", (req, res) => {
    connection.query("Select * from user", (err, result) => {
        if(err) {
            console.log("error: ", err);
            return res.status(500).json({message: "Failed to return users"});
        }
        else {
            return res.status(200).json(result);
        }
    })
});

//get user by ID
app.get("/users/:id", (req, res) => {
    const userId = req.params.id;
    connection.query("Select * from user where id = ? ", userId, (err, result) => {
        if (err) {
            console.log("error: ", err);
            return res.status(500).json({message: "Failed to find user"});
        }
        const userResponse = {
            firstname: result[0].firstname,
            id: result[0].id,
            email: result[0].email
        }

        console.log(userResponse);
        
        return res.status(200).json(userResponse);

        
    })
});


//logging in users
app.post("/users/authentication", (req, res) => {
    const authReq = req.body;
    //check if email exists:
    email = authReq.email;
    password = authReq.password;
    connection.query("SELECT * FROM user WHERE email = ? AND password = ?",
    [
        authReq.email, authReq.password
    ], (err, result) => {
        if(err) {
            return res.status(500).json({message: "Error - failed to login"});
        }
        if (result.length === 0) {
            return res.status(401).json({message: "Invalid email or password"});
        }

        //create new object without the password
        const responseUser = {
            id: result[0].id,
            firstname: result[0].firstname,
            lastname: result[0].lastname,
            email: result[0].email
        }

        return res.json(responseUser);

    })

});

//creating new listings
app.post("/listings", (req, res) => {

    const listing = req.body;
    console.log(listing)

    connection.query("INSERT INTO listing SET ?", listing, (err, result) => {
        if (err) {
            console.log(err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: err.sqlMessage });
            } else {
                return res.status(500).json({ message: "Failed to insert. Please try again." });
            }
        }

        console.log(result);

        var responseListing = {
            id: result.insertId,
            name: listing.name,
            location: listing.location,
            price: listing.price,
            imageUrl: listing.imageUrl,
            userId: listing.userId
        };

        return res.status(200).json(responseListing);
    });
});

//update specific listing
app.post("/listings/:id", (req, res) => {
    const ListingId = req.params.id;
    listing = req.body;
    console.log(listing)

    connection.query("UPDATE listing SET ? WHERE id = ?",
        [listing, ListingId], (err, result) => {
            if (err) {
                console.log("error: ", err);
            }

            console.log(result);

            var updatedListing = {
                id: listing.id,
                name: listing.name,
                location: listing.location,
                imageUrl: listing.imageUrl,
                price: listing.price
            };

            return res.status(200).json(updatedListing);



        });
});

//delete listing by id
app.delete("/listings/:id", (req, res) => {
    const propertyId = req.params.id;
    listing = req.body;
    connection.query("DELETE FROM listing WHERE id = ?", propertyId, (err, result) => {
        if (err) {
            console.log("error: ", err);
        }
        else {
            res.status(200).json({ message: "Successfully deleted" })
        }
    })
});

//get all listings
app.get("/listings", (req, res) => {
    connection.query("Select * from listing", (err, result) => {
        if(err) {
            console.log("error: ", err);
            return res.status(500).json({message: "Failed to return properties"});
        }
        else {
            return res.status(200).json(result);
        }
    })
});

//get listings by id
app.get("/listings/:id", (req, res) => {
    const propertyId = req.params.id;
    // listing = req.body;
    connection.query("Select * from listing where id = ? ", propertyId, (err, result) => {
        if (err) {
            console.log("error: ", err);
            return res.status(500).json({message: "Failed to find property"});
        }
        else {
            return res.status(200).json(result);

        }
    })
});

//get all listings by user id
app.get("/listings/user/:id", (req, res) => {
    const userId = req.params.id;
    connection.query("Select * from listing where userId = ? ", userId, (err, result) => {

        if( err ) {
            console.log("error: ", err);
        }
        if (result.length === 0) {
            console.log("User has no listings.");
        }
        else {
            return res.status(200).json(result); //will be an array
        }
    })

});

//creating new bookings
app.post("/bookings", (req, res) => {

    const request = req.body;
    console.log(request)

    connection.query("INSERT INTO booking SET ?", request, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
        console.log(result.insertId);

        var responseRequest = {
            id: result.insertId,
            userId: request.userId,
            propertyId: request.propertyId,
            startDate: request.startDate,
            endDate: request.endDate,
            status: request.status
        }

        };

        console.log(responseRequest.id);

        return res.status(200).json(responseRequest);
    });
});

//logging in
// app.post("/users/authentication", (req, res) => {
//     const user = req.body;
//     const bodyEmail = user.email;
//     const bodyPassword = user.password;

//     //checking if email field is blank
//     if (!bodyEmail) {
//         return res.status(400).json({ message: "Invalid email" });
//     }

//     //checking if password field is blank
//     if (!bodyPassword) {
//         return res.status(400).json({ message: "Please enter a password" })
//     }


//     //checking if email matches email in database
//     //then checking if password matches
//     users.forEach(aUser => {
//         if (bodyEmail === aUser.email) {
//             if (bodyPassword === aUser.password) {
//                 //how to combine??
//                 res.send("Login successful; found user!");
//                 res.send(aUser.email);
//             }
//             else {
//                 return res.status(400).json({ message: "Wrong password" });
//             }
//         }
//     })

// });


//finding booking requests for a given property
app.get("/bookings/:id", (req, res) => {
    const propertyId = req.params.id;
    connection.query("Select * from booking where propertyId = ? ", propertyId, (err, result) => {

        if( err ) {
            console.log("error: ", err);
        }
        if (result.length === 0) {
            console.log("Property has no requests.");
        }
        else {
            return res.status(200).json(result); //will be an array
        }
    })
})

//get all bookings
app.get("/bookings", (req, res) => {
    connection.query("Select * from booking", (err, result) => {
        if(err) {
            console.log("error: ", err);
            return res.status(500).json({message: "Failed to return bookings"});
        }
        else {
            return res.status(200).json(result);
        }
    })
});

//update book request - for provider to accept/reject
app.post("/booking/:id", (req, res) => {
    const bookingId = req.params.id;
    booking = req.body;
    console.log(listing)

    connection.query("UPDATE listing SET ? WHERE id = ?",
        [booking, bookingId], (err, result) => {
            if (err) {
                console.log("error: ", err);
            }

            console.log(result);

            var updatedListing = {
                id: result.insertId,
                userId: request.userId,
                propertyId: request.propertyId,
                startDate: request.startDate,
                endDate: request.endDate,
                status: request.status
            };

            return res.status(200).json(updatedListing);



        });
});


app.listen(4000, () => console.log("Server is running on 4000."));
