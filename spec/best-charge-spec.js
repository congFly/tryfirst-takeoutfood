describe('Take out food', function () {

  it('should generate best charge when best is 指定菜品半价', function () {
    let idItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(idItems).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function () {
    let idItems = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(idItems).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function () {
    let idItems = ["ITEM0013 x 4"];
    let summary = bestCharge(idItems).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});

describe("test formateItems",function () {
  it("get itemsCount",function () {
    let idItems=["ITEM0001 x 4", "ITEM0013 x 2", "ITEM0022 x 1"];
    let result = formatItems(idItems);
    expect(result).toEqual([
      {
        id:'ITEM0001',
        count:4
      },
      {
        id:'ITEM0013',
        count:2
      },
      {
        id:'ITEM0022',
        count:1
      }
    ]);
  })
});

describe("test matchPromotions",function () {
  it("get itemsType",function () {
    let itemsCount = [
      {
        id:'ITEM0001',
        count:2
      },
      {
        id:'ITEM0013',
        count:1
      },
      {
        id:'ITEM0022',
        count:2
      }
    ];
    let promotions = [{
      type: '满30减6元'
    },
      {
        type: '指定菜品半价',
        items: ['ITEM0001', 'ITEM0022']
      }];
    let result = matchPromotions(itemsCount, promotions);
    expect(result).toEqual([
      {
        id:'ITEM0001',
        count:2,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0013',
        count:1,
        type: '满30减6元'
      },
      {
        id:'ITEM0022',
        count:2,
        type: '指定菜品半价'
      }
    ]);
  })
});

describe("test getItemsInfo",function () {
  it("get itemsInfo",function () {
    let itemsType = [
      {
        id:'ITEM0001',
        count:2,
        type: '满30减6元'
      },
      {
        id:'ITEM0013',
        count:13,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0022',
        count:1,
        type: '指定菜品半价'
      }
    ];
    let allItems = [
      {
        id: 'ITEM0001',
        name: '黄焖鸡',
        price: 18.00
      },
      {
        id: 'ITEM0013',
        name: '肉夹馍',
        price: 6.00
      },
      {
        id: 'ITEM0022',
        name: '凉皮',
        price: 8.00
      },
      {
        id: 'ITEM0030',
        name: '冰锋',
        price: 2.00
      }];
    let result = getItemsInfo(itemsType, allItems);
    expect(result).toEqual([
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count:2,
        type: '满30减6元'
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count:13,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        count:1,
        type: '指定菜品半价'
      }
    ]);
  })
});

describe("test getSubtotal",function () {
  it("get subtotalSum",function () {
    let itemsInfo = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count:3,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count:1,
        type: '满30减6元'
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        count:2,
        type: '指定菜品半价'
      }
    ];
    let result = getSubtotal(itemsInfo);
    expect(result).toEqual( [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count:3,
        type: '指定菜品半价',
        subtotal:54.00
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count:1,
        type: '满30减6元',
        subtotal:6.00
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        count:2,
        type: '指定菜品半价',
        subtotal:16.00
      }
    ]);
  })
});

describe("test getTotal",function () {
  it("get total",function () {
    let subtotalSum = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count:2,
        type: '指定菜品半价',
        subtotal:36.00
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count:2,
        type: '满30减6元',
        subtotal:12.00
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        count:1,
        type: '指定菜品半价',
        subtotal:8.00
      }
    ];
    let result = getTotal(subtotalSum);
    expect(result).toEqual(56.00);
  })
});

describe("test getDiscountSubtotal",function () {
  it("get discountSubtotalSum",function () {
    let itemsInfo = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count:3,
        type: '指定菜品半价'
      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count:6,
        type: '满30减6元'
      }];
    let result = getDiscountSubtotal(itemsInfo);
    expect(result).toEqual([
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count:3,
        type: '指定菜品半价',
        discountSubtotal:27.00

      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count:6,
        type: '满30减6元',
        discountSubtotal:36.00
      }
    ]);
  })
});

describe("test getMinTotal",function () {
  it("get minTotal",function () {
    let discountSubtotalSum = [
      {
        id:'ITEM0001',
        name: '黄焖鸡',
        price: 18.00,
        count:2,
        type: '指定菜品半价',
        discountSubtotal:18.00

      },
      {
        id:'ITEM0013',
        name: '肉夹馍',
        price: 6.00,
        count:2,
        type: '满30减6元',
        discountSubtotal:12.00
      },
      {
        id:'ITEM0022',
        name: '凉皮',
        price: 8.00,
        count:2,
        type: '指定菜品半价',
        discountSubtotal:8.00
      }
    ];
    let total = 64.00;
    let result = getMinTotal(discountSubtotalSum, total);
    expect(result).toEqual(38);
  })
});



