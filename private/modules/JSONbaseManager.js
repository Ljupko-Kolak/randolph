let fs = require("fs");

class JSONbaseManager {
  constructor() {
    this.database = {};
  }

  makeNewBase() {
    this.database = {
      metadata: {
        nextID: 0,
        totalItems: 0,
      },
      venues: []
    };
  };

  load(path) {
    let raw = fs.readFileSync(path);
    this.database = JSON.parse(raw);
  };
  save(path) {
    let raw = JSON.stringify(this.database, null, 2);
    fs.writeFileSync(path, raw);
  };

  create(newEntry, group) {
    if (Object.keys(this.database).toLocaleString().includes(group) === false) {
      this.database[group] = [];
    }

    let date = new Date();
    let now = date.getFullYear() + "|" + (date.getMonth() + 1) + "|" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();

    newEntry.dateAdded = now;
    newEntry.lastUpdate = now;
    newEntry.ID = this.database.metadata.nextID;
    this.database[group].push(newEntry);

    this.database.metadata.nextID++;
    this.database.metadata.totalItems++;
  };
  read(id) {
    for (let group in this.database) {
      for (let entry in this.database[group]) {
        if (this.database[group][entry].ID === id) {
          return this.database[group][entry];
        };
      }
    }
  };
  update(id, newValue) {
    // have to reuse the read() code
    // because the change doesn't persist otherwise
    // (assigning the return object of read()
    // to a new variable is the issue)
    for (let group in this.database) {
      for (let entry in this.database[group]) {
        if (this.database[group][entry].ID === id) {
          this.database[group][entry] = newValue;

          let date = new Date();
          let now = date.getFullYear() + "|" + (date.getMonth() + 1) + "|" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
      
          this.database[group][entry].lastUpdate = now;
        };
      }
    };
  };
  delete(id) {
    for (let group in this.database) {
      for (let entry in this.database[group]) {
        if (this.database[group][entry].ID === id) {
          this.database[group].splice(this.database[group].indexOf(this.database[group][entry]), 1);
          this.database.metadata.totalItems--;
          return;
        };
      }
    }
  };

  venueExists(venue) {
    let venueInfo = "";
    venueInfo += venue.name;
    venueInfo += venue.countryCode ;
    venueInfo += venue.city;
    venueInfo += venue.street;
    venueInfo = venueInfo.toLowerCase().split(" ").join("");

    if (Object.keys(this.database).toLocaleString().includes("venues")) {
      for (let i = 0; i < this.database.venues.length; i++) {
        let entryInfo = "";
        entryInfo += this.database.venues[i].name;
        entryInfo += this.database.venues[i].countryCode;
        entryInfo += this.database.venues[i].city;
        entryInfo += this.database.venues[i].street;
        entryInfo = entryInfo.toLowerCase().split(" ").join("");
        if (entryInfo === venueInfo) {
          return this.database.venues[i];
        }
      }
      return false;
    }
  };
}

module.exports = JSONbaseManager;