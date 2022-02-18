class Item {
  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items = []) {
    this.items = items;
    this.qualityChange = -1;
  }
  updateQuality() {
    this.items.forEach((item) => {
      this.adjustSellInDate(item);
      this.adjustQuality(item);
    });
    return this.items;
  }

  adjustSellInDate(item) {
    if (item.name === ItemNames.SULFURAS) {
      return;
    }
    item.sellIn--;
  }

  adjustQuality(item) {
    if (item.name === ItemNames.SULFURAS) {
      return;
    }
    const adjustedQuality = item.quality + this.computeQualityAdjustment(item);
    if (adjustedQuality >= 0 && adjustedQuality <= 50) {
      item.quality = adjustedQuality;
    }
  }

  computeQualityAdjustment(item) {
    let adjustment = this.qualityChange;
    if (this.isIncreasingValueItem(item)) {
      adjustment = 1;
    }
    if (item.name === ItemNames.BACKSTAGE_PASS) {
      // Backstage passes have their own unique rules.
      if (this.isExpired(item)) {
        // Backstage passes lose all value when expired.
        adjustment = -item.quality;
      } else if (item.sellIn <= 5) {
        adjustment = adjustment * 3;
      } else if (item.sellIn <= 10) {
        adjustment = adjustment * 2;
      }
    } else if (this.isExpired(item) || this.isConjured(item)) {
      // Expired items adjust their price by double the rate.
      adjustment = adjustment * 2;
    }
    return adjustment;
  }

  isIncreasingValueItem(item) {
    return (
      item.name === ItemNames.AGED_BRIE ||
      item.name === ItemNames.BACKSTAGE_PASS
    );
  }

  isExpired(item) {
    return item.sellIn < 0;
  }

  isConjured(item) {
    return item.name.startsWith("Conjured");
  }
}

const ItemNames = {
  BACKSTAGE_PASS: "Backstage passes to a TAFKAL80ETC concert",
  AGED_BRIE: "Aged Brie",
  SULFURAS: "Sulfuras, Hand of Ragnaros",
};

module.exports = {
  Item,
  Shop,
  ItemNames,
};
