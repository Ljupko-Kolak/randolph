class MenuItem {
  constructor(name, price, amount, isFood = false, isMassItem = false) {
    this.name = name;
    this.price = price;
    this.amount = amount;
    this.isFood = isFood;
    // if the amount ordered is not in pieces, but in liters/grams
    // usually used for drought beer and hard drinks
    this.isMassItem = isMassItem;
  }

  getFormattedPrice(currency) {
    let formattedPrice = this.price + " " + currency;
    return formattedPrice;
  };
  getFormattedAmount(isInMetricUnits = true) {
    if (isInMetricUnits) {
      if (this.isFood) {
        return this.amount + " g";
      } else {
        return this.amount + " l";
      }
    } else {
      if (this.isFood) {
        return this.amount + " lbs";
      } else {
        return this.amount + " oz";
      }
    }
  };
}

module.exports = MenuItem;