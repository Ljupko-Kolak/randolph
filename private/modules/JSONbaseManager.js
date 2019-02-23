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
      }
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
    let oldValue = this.read(id);
    oldValue = newValue;

    let date = new Date();
    let now = date.getFullYear() + "|" + (date.getMonth() + 1) + "|" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();

    oldValue.lastUpdate = now;
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
    let venueInfo = venue.name + venue.country + venue.city + venue.street;

    if (Object.keys(this.database).toLocaleString().includes("venues")) {
      for (let i = 0; i < this.database.venues.length; i++) {
        let entryInfo = this.database.venues[i].name + this.database.venues[i].country + this.database.venues[i].city + this.database.venues[i].street;
        if (entryInfo === venueInfo) {
          return true;
        }
      }
      return false;
    }
  };
}

module.exports = JSONbaseManager;