const Inventory = require("./Inventory.js");

class Venue {
  constructor(name, countryCode, city, street) {
    this.name = name;
    this.countryCode = countryCode;
    this.city = city;
    this.street = street;

    this.inventory = new Inventory();
    this.orders = null;

    this.staff = null;
    this.map = null;
  }
}

module.exports = Venue;