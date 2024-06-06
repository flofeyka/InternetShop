const User = require("../models/User");
const Purchase = require("../models/Purchase");
const PurchaseDto = require("../dtos/purchaseDto");
const ApiError = require("../exceptions/api-error");
const Order = require("../models/Order");
const OrderDto = require("../dtos/orderDto")

module.exports = new class purchaseService {
    async getHistory(id) {
        const user = await User.findById(id);
        let purchasesArray = [];
        for(let i = 0; i < user.purchasesHistory.length; i++) {
            const historyItem = await Purchase.findById(user.purchasesHistory[i]);
            purchasesArray.push(await historyItem)
        }
        return purchasesArray;
    }

    async clearHistory(id) {
        const clearHistory = await User.updateOne({_id: id}, { purchasesHistory: [] });
        return clearHistory.modifiedCount === 1;
    }

    async HaveOrder(userId, purchaseId, orderCount) {
        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) {
            throw ApiError.notFound(404, "Purchase is not found");
        }
        const purchaseQuantityModified = await Purchase.updateOne({_id: purchaseId}, {
            quantity: purchase.quantity - orderCount
        })
        if(purchaseQuantityModified.modifiedCount !== 1) {
            throw ApiError.notFound(404, "Cannot to order the purchase")
        }
        const order = await Order.create({
            purchaseId,
            waiter: userId,
            finalPrice: purchase.price * orderCount + purchase.price * orderCount * 0.07,
            createdAt: Date.now()
        });

        const orderDto = new OrderDto(order);

        const user = await User.findById(purchase.owner);
        const orderToOwner = await User.updateOne({_id: user._id}, {
            $push: {ordersOnMyProducts: orderDto.id}
        });
        if (orderToOwner.modifiedCount !== 1) {
            throw ApiError.notFound(500, "Cannot order the product");
        }
        const waiter = await User.findById(userId);
        if (!waiter) {
            throw ApiError.BadRequest(`User with id ${userId} is not found`);
        }
        const orderToWaiter = await User.updateOne({
            _id: userId
        }, {
            $push: {
                myOrders: orderDto.id
            }
        });

        await Purchase.updateOne({_id: purchaseId}, {
            ordersCount: purchase.ordersCount + 1
        })

        if(orderToWaiter.modifiedCount !== 1) {
            throw ApiError.BadRequest("Cannot order the product")
        }

        return orderDto;
    }

    async getPurchaseById(userId, id) {
        const purchase = await Purchase.findById(id);
        if (!purchase) {
            throw ApiError.notFound(404, "Purchase is not found");
        }
        const purchaseDto = new PurchaseDto(purchase);
        const user = await User.findById(userId);
        const purchaseInHistoryFound = user.purchasesHistory.find(i => i.toString() === purchase.id);
        if(!purchaseInHistoryFound) {
            await User.updateOne({_id: userId}, {
                $push: {
                    purchasesHistory: purchaseDto.id
                }
            });
            await Purchase.updateOne({_id: id}, {
                viewsCount: purchase.viewsCount + 1
            })
        }
        return purchaseDto;
    }
}