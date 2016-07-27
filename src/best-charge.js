let idItems = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
function formatItems(idItems) {
    let itemsCount = idItems.map(
        function (idItem) {
            let temp = idItem.split(" x ");
            return {
                id: temp[0],
                count: parseInt(temp[1])
            }
        }
    );
    return itemsCount;
}

function matchPromotions(itemsCount, promotions) {
    let itemsType = [];
    for (let i = 0; i < itemsCount.length; i++) {
        promotions.find(function (item) {
            if (item.items) {
                let existItems = item.items.find(function (id) {
                    return id === itemsCount[i].id;
                });
                if (existItems) {
                    type = item.type;
                }
            }
            else {
                type = '满30减6元';
            }

        });
        itemsType.push(Object.assign({}, itemsCount[i], {type: type}));
    }
    return itemsType;
}

function getItemsInfo(itemsType, allItems) {
    let itemsInfo = [];
    for (let i = 0; i < itemsType.length; i++) {
        let existItems = allItems.find(function (item) {
            if (item.id === itemsType[i].id) {
                return item;
            }
        });
        if (existItems) {
            itemsInfo.push(Object.assign({}, existItems, {type: itemsType[i].type}, {count: itemsType[i].count}));
        }
    }
    return itemsInfo;
}

function getSubtotal(itemsInfo) {
    let subtotalSum = [];
    let subtotal = 0;
    for (let i = 0; i < itemsInfo.length; i++) {
        subtotal = itemsInfo[i].price * itemsInfo[i].count;
        subtotalSum.push(Object.assign({}, itemsInfo[i], {subtotal: subtotal}));
    }
    return subtotalSum;
}

function getTotal(subtotalSum) {
    let total = 0;
    for (let i = 0; i < subtotalSum.length; i++) {
        total += subtotalSum[i].subtotal;
    }
    return total;
}

function getDiscountSubtotal(itemsInfo) {
    let discountSubtotalSum = [];
    let discountSubtotal = 0;
    for (let i = 0; i < itemsInfo.length; i++) {
        if (itemsInfo[i].type === '指定菜品半价') {
            discountSubtotal = itemsInfo[i].count /2* itemsInfo[i].price ;
        }
        else {
            discountSubtotal = itemsInfo[i].count * itemsInfo[i].price;
        }
        discountSubtotalSum.push(Object.assign({}, itemsInfo[i], {discountSubtotal: discountSubtotal}));
    }
    return discountSubtotalSum;
}

function getMinTotal(discountSubtotalSum, total) {
    let discountTotal = 0;
    let minTotal = total;
    for (let i = 0; i < discountSubtotalSum.length; i++) {
        discountTotal += discountSubtotalSum[i].discountSubtotal;
    }
    if (total > 30) {
        if ((total - 6) > discountTotal) {
            minTotal = discountTotal;
        }
        else {
            minTotal = total - 6;
        }
    }
    return minTotal;
}

function print(subtotalSum,discountTotal,total) {
    let receipt = "============= 订餐明细 =============\n";
    for (let i = 0; i < subtotalSum.length; i++) {
        receipt += subtotalSum[i].name + " x " + subtotalSum[i].count + " = " + subtotalSum[i].subtotal
            + "元\n";
    }
    receipt += '-----------------------------------';
    if (total > 30) {
        receipt += '\n';
    }
    if (total > 30) {
        receipt += '使用优惠:\n';
        if (discountTotal < (total - 6)) {
            receipt += '指定菜品半价(';
            for (let i = 0; i < subtotalSum.length; i++) {
                if (subtotalSum[i].type === '指定菜品半价') {
                    receipt += subtotalSum[i].name;
                    for (let j = i + 1; j < subtotalSum.length; j++) {
                        if (subtotalSum[j].type === '指定菜品半价') {
                            receipt += '，';
                        }
                    }
                }
            }receipt += ')，省' + (total - discountTotal) + '元\n' +
                '-----------------------------------\n'
        }
        else {
            receipt += '满30减6元';
            receipt += '，省' + (total - discountTotal) + '元\n' +
                '-----------------------------------\n'
        }
    }
    if (total < 30) {
        receipt += '\n';
    }
    receipt += '总计：' + discountTotal + '元\n' +
        '===================================';
    return receipt;
}

function bestCharge(idItems) {
    let allItems = loadAllItems();
    let promotions = loadPromotions();
    let itemsCount = formatItems(idItems);
    let itemsType = matchPromotions(itemsCount, promotions);
    let itemsInfo = getItemsInfo(itemsType, allItems);
    let subtotalSum = getSubtotal(itemsInfo);
    let total = getTotal(subtotalSum);
    let discountSubtotalSum = getDiscountSubtotal(itemsInfo);
    let minTotal = getMinTotal(discountSubtotalSum, total);
    let receipt = print(subtotalSum, minTotal, total);
    return receipt;
}
