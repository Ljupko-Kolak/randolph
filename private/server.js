let express = require("express");
let app = express();

let path = require("path");
let privatePath = path.join(__dirname, "../private/");
let publicPath = path.join(__dirname, "../public/");

let bodyParser = require("body-parser");
app.use(bodyParser.json());

/* START OF MY MODULES */

let JSONbaseManager = require("./modules/JSONbaseManager.js");
let DBmanager = new JSONbaseManager();
let dbPath = privatePath + "database/JSONbase.json";
DBmanager.load(dbPath);

let Venue = require("./modules/Venue.js");

/* END OF MY MODULES */

app.get("*", function (req, res) {
  if (req.originalUrl === "/") {
    // send to homepage
    res.sendFile(publicPath + "index.html");
  } else if (req.originalUrl.includes("/private/")) {
    // if they want to go where they shouldn't
    res.send("<h1>ERROR 404</h1><h3>Page not found!</h3>");
  } else {
    // send whatever the URL says should be sent
    res.sendFile(
      publicPath + req.originalUrl,
      {},
      function (err) {
        // unless the file cannot be found
        if (err) {
          res.send("<h1>ERROR 404</h1><h3>Page not found!</h3>");
        }
      }
    );
  }
});

app.post("/register-new-venue", function (req, res) {
  let newVenue = new Venue(
    req.body.venueName,
    req.body.countryTag,
    req.body.city,
    req.body.street,
    req.body.administrator
  );
  if (DBmanager.venueExists(newVenue)) {
    res.json({ status: "exists" });
  } else {
    DBmanager.create(newVenue, "venues");
    DBmanager.save(dbPath);
    res.json({ status: "added" });
  }
});
app.post("/venue-manager", function (req, res) {
  let newVenue = new Venue(
    req.body.venueName,
    req.body.countryTag,
    req.body.city,
    req.body.street,
    req.body.administrator
  );
  let v = DBmanager.venueExists(newVenue);
  if (v) {
    let adminFound = false;
    for (let i = 0; i < v.administrators.length; i++) {
      if (v.administrators[i].name === req.body.administrator) {
        adminFound = true;
        break;
      }
    }
    if (adminFound) {
      //res.json({ status: "found" });
      res.write(JSON.stringify({ status: "found" }));
      res.write("NEWSTRING");
      res.write(JSON.stringify(v));
      res.end();
    } else {
      res.json({ status: "denied" });
    }
  } else {
    res.json({ status: "not found" });
  }
});
app.post("/update-venue", function (req, res) {
  DBmanager.update(req.body.ID, req.body);
  DBmanager.save(dbPath);
  res.json({ status: "success" });
});

var server = app.listen(3000, function () {
  console.log("Node server is running...");
});