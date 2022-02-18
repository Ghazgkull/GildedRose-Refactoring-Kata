const {Shop, Item, ItemNames} = require("../src/gilded_rose");

describe("Gilded Rose", function() {
  it("should foo", function() {
    const gildedRose = new Shop([new Item("foo", 0, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].name).toBe("foo");
  });

  describe('UpdateQuality', () => {

    let testItemName, testItemSellIn, testItemQuality, testItem, testShop;

    beforeEach(()=> {
      testItemName = 'foo';
      testItemSellIn = 3;
      testItemQuality = 40;
      testItem = new Item(testItemName, testItemSellIn, testItemQuality);
      testShop = new Shop([testItem]);
    });

    it('degrades quality by 1 as SellIn date approaches', () => {
      testShop.updateQuality();
      expect(testItem.quality).toEqual(testItemQuality - 1);
    });

    it('degrades quality twice as fast after the SellIn date passes', () => {
      testItem.sellIn = -1;
      testShop.updateQuality();
      expect(testItem.quality).toEqual(testItemQuality - 2);
    });

    it('increases the quality of Aged Brie as it ages', () => {
      const agedBrie = new Item(ItemNames.AGED_BRIE, 7, 10);
      testShop.items.push(agedBrie);
      testShop.updateQuality();
      expect(agedBrie.quality).toEqual(11);
    });

    it('ensures item quality never exceeds 50', () => {
      const agedBrie = new Item(ItemNames.AGED_BRIE, 7, 50);
      testShop.items.push(agedBrie);
      testShop.updateQuality();
      expect(agedBrie.quality).toEqual(50);
    });

    it('does not modify the quality or sellIn date of Sulfuras', () => {
      const sulfuras = new Item(ItemNames.SULFURAS, 7, 80);
      testShop.items.push(sulfuras);
      testShop.updateQuality();
      expect(sulfuras.quality).toEqual(80);
      expect(sulfuras.sellIn).toEqual(7);
    });

    it('increases the quality of backstage passes as they age', () => {
      const backstagePass = new Item(ItemNames.BACKSTAGE_PASS, 20, 10);
      testShop.items.push(backstagePass);
      testShop.updateQuality();
      expect(backstagePass.quality).toEqual(11);
    });

    it('increases quality of backstage passes by 2 when there are 10 days or less', () => {
      const backstagePass = new Item(ItemNames.BACKSTAGE_PASS, 10, 10);
      testShop.items.push(backstagePass);
      testShop.updateQuality();
      expect(backstagePass.quality).toEqual(12);
    });

    it('increases quality of backstage passes by 3 when there are 5 days or less', () => {
      const backstagePass = new Item(ItemNames.BACKSTAGE_PASS, 5, 10);
      testShop.items.push(backstagePass);
      testShop.updateQuality();
      expect(backstagePass.quality).toEqual(13);
    });

    it('decreases quality of backstage passes to 0 after sellIn date expires', () => {
      const backstagePass = new Item(ItemNames.BACKSTAGE_PASS, -1, 10);
      testShop.items.push(backstagePass);
      testShop.updateQuality();
      expect(backstagePass.quality).toEqual(0);
    });

    it('decreases quality of conjured items by double the normal rate', () => {
      const conjuredItem = new Item("Conjured bread", 7, 10);
      testShop.items.push(conjuredItem);
      testShop.updateQuality();
      expect(conjuredItem.quality).toEqual(8);
    });

  });

});
