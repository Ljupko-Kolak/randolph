const MenuItem = require("./MenuItem.js");

class Inventory {
  constructor() {
    this.nextID = 0;
    this.items = [];
  }

  addItem(item, category) {
    if (typeof item === typeof MenuItem) {
      let newItem = item;
      let cat = category.toLowerCase();
      if (Object.keys(this.items).toLocaleString().includes(cat) === false) {
        this.items[cat] = [];
      }
      newItem.ID = this.nextID;
      this.items[cat].push(newItem);
      this.nextID++;
    }
  };

  deleteItem(id) {
    for (let category in this.items) {
      for (let i = 0; i < this.items[category].length; i++) {
        if (this.items[category][i].ID === id) {
          this.items[category].splice(i, 1);
          return;
        }
      }
    }
  };
};

module.exports = Inventory;