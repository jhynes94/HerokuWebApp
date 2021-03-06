var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});


// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/contacts", function (req, res) {
    db.collection(CONTACTS_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.post("/contacts", function (req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();

    if (!(req.body.firstName || req.body.lastName)) {
        handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
    }

    db.collection(CONTACTS_COLLECTION).insertOne(newContact, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/contacts/:id", function (req, res) {
    db.collection(CONTACTS_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to get contact");
        } else {
            res.status(200).json(doc);
        }
    });
});

app.put("/contacts/:id", function (req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;

    db.collection(CONTACTS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update contact");
        } else {
            res.status(204).end();
        }
    });
});

app.delete("/contacts/:id", function (req, res) {
    db.collection(CONTACTS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete contact");
        } else {
            res.status(204).end();
        }
    });
});

///////////////////////////////////////Begin Catalog Code Here/////////////////

var CATALOG_COLLECTION = "catalog";

//Get list of ENTIRE catalog objects
app.get("/catalog", function (req, res) {
    db.collection(CATALOG_COLLECTION).find({}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get catalog.");
        } else {
            res.status(200).json(docs);
        }
    });
});

//Post a Part
app.post("/catalog", function (req, res) {
    var newPart = req.body;
    newPart.createDate = new Date();

    if (!(req.body.PN || req.body.MPN || req.body.Description)) {
        handleError(res, "Invalid user input", "Must provide Data of some type!", 400);
    }
    db.collection(CATALOG_COLLECTION).insertOne(newPart, function (err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new part.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});


//Create a part from Barcode
app.get("/catalog/barcode/:barcode", function (req, res) {
    console.log("Barcode:" + req.params.barcode);

    myVar = setTimeout(timeoutFunction, 1000);

    function timeoutFunction() {
        res.status(400).send("Failed to add barcode");
        //process.kill('SIGHUP');
    }


    var spawn = require("child_process").spawn;
    var process = spawn('python', ["python/digi_reader.py", req.params.barcode]);

    process.stdout.on('data', function (data) {
        clearTimeout(myVar)

        console.log("\nPython program Output: " + data);
        var arr = data.toString().split("||");
        var newPart = {};
        newPart.PN = arr[1];
        console.log("Part Number: " + newPart.PN);
        newPart.MPN = arr[2];
        console.log("Man Part Number: " + newPart.MPN);
        newPart.Description = arr[3];
        console.log("Description: " + newPart.Description);
        newPart.createDate = new Date();


        //check if part is already in DB
        db.collection(CATALOG_COLLECTION).find({PN: newPart.PN}).toArray(function (err, docs) {
            if (err) {
                handleError(res, err.message, "Failed to Find Item");
            } else {
                db.collection(CATALOG_COLLECTION).find({MPN: newPart.MPN}).toArray(function (err, docs2) {
                    if (err) {
                        handleError(res, err.message, "Failed to Find Item");
                    } else {
                        var docsSend = docs.concat(docs2);

                        if (docsSend.length > 0){
                            console.log("Preventing Duplicate Part");
                            res.status(400).send("Part Already Exists");
                        }
                        else {
                            AddToDB();
                        }
                    }
                });
            }
        });


        function AddToDB(){
            db.collection(CATALOG_COLLECTION).insertOne(newPart, function (err, doc) {
                if (err) {
                    handleError(res, err.message, "Failed to create new part.");
                } else {
                    db.collection(CATALOG_COLLECTION).find({}).toArray(function (err, docs) {
                        if (err) {
                            handleError(res, err.message, "Failed to get catalog.");
                        } else {
                            res.status(200).json(docs);
                        }
                    });
                }
            });
        }
    });
});

//Delete a part
app.delete("/catalog/:id", function (req, res) {
    db.collection(CATALOG_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function (err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete contact");
        } else {
            res.status(204).end();
        }
    });
});


Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

//Search For Part
app.get("/api/part", function (req, res) {
    //var query = req.params.query;
    var query = req.query["search"];
    console.log("Searched for: " + query);

    db.collection(CATALOG_COLLECTION).find({PN: query}).toArray(function (err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to Find Item");
        } else {
            db.collection(CATALOG_COLLECTION).find({MPN: query}).toArray(function (err, docs2) {
                if (err) {
                    handleError(res, err.message, "Failed to Find Item");
                } else {
                    var docsSend = docs.concat(docs2).unique();
                    res.status(200).json(docsSend);
                    console.log(docsSend);
                }
            });
        }
    });
});