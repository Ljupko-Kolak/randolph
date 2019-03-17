const Inventory = require("./Inventory.js");

class Venue {
  constructor(name, countryCode, city, street, administartor) {
    this.name = name;
    this.countryCode = countryCode;
    this.city = city;
    this.street = street;

    this.inventory = new Inventory();
    this.orders = [];

    this.administartors = [administartor];
    this.staff = [];
    this.map = null;
  }
}

module.exports = Venue;