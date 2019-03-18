const Inventory = require("./Inventory.js");

class Venue {
  constructor(name, countryCode, city, street, administrator) {
    this.name = name;
    this.countryCode = countryCode;
    this.city = city;
    this.street = street;

    this.isPublic = false;

    this.inventory = new Inventory();
    this.orders = [];

    this.administrators = [administrator];
    this.staff = [];
    this.map = null;
  }
}

module.exports = Venue;