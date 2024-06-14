const User = require("../models/User");
const Purchase = require("../models/Purchase");
const PurchaseDto = require("../dtos/purchaseDto");
const ApiError = require("../exceptions/api-error");
const Order = require("../models/Order");
const OrderDto = require("../dtos/orderDto")

module.exports = new class purchaseService {
    async getAll(sort = "popularity", search = "", page = 1, pageSize = 10) {
        const purchasesFound = await Purchase.find({name: {$regex: search}}, {}, {skip: Math.ceil((page-1)*pageSize) + 1, limit: pageSize});
        switch (sort) {
            case "popularity":
                purchasesFound.sort((a, b) => a.viewsCount > b.viewsCount ? -1 : 0);
                break;
            case "expensive":
                purchasesFound.sort((a, b) => a.price > b.price ? 0 : -1);
                break;
            case "cheap":
                purchasesFound.sort((a, b) => a.price > b.price ? -1 : 0);
                break;
            default:
                break;
        }

        let purchasesArray = [];
        for(let i = 0; i < purchasesFound.length; i++) {
            const purchaseDto = new PurchaseDto(purchasesFound[i]);
            purchasesArray.push(purchaseDto);
        }
        return purchasesArray;
    }

    async getHistory(id) {
        const user = await User.findById(id);
        let purchasesArray = [];
        for (let i = 0; i < user.purchasesHistory.length; i++) {
            const historyItem = await Purchase.findById(user.purchasesHistory[i]);
            const purchaseDto = new PurchaseDto(historyItem);
            purchasesArray.push(purchaseDto);
        }
        return purchasesArray;
    }

    async clearHistory(id) {
        const clearHistory = await User.updateOne({_id: id}, {purchasesHistory: []});
        return clearHistory.modifiedCount === 1;
    }

    async HaveOrder(userId, id, orderCount, address, deadline) {
        const purchase = await Purchase.findById(id);
        if (!purchase) {
            throw ApiError.notFound(404, "Purchase is not found");
        }
        if(purchase.ordersCount < orderCount) {
            throw ApiError.BadRequest("This product is less than count you want to order")
        }
        const purchaseQuantityModified = await Purchase.updateOne({_id: id}, {
            quantity: purchase.quantity - orderCount
        })
        if (purchaseQuantityModified.modifiedCount !== 1) {
            throw ApiError.notFound(404, "Cannot to order the purchase")
        }
        const order = await Order.create({
            purchaseId: id,
            waiter: userId,
            finalPrice: purchase.price * orderCount,
            address,
            deadline,
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

        const purchaseOrderCountUpdated = await Purchase.updateOne({_id: id}, {
            ordersCount: purchase.ordersCount + orderCount
        })

        if (orderToWaiter.modifiedCount !== 1 || purchaseOrderCountUpdated.modifiedCount !== 1) {
            throw ApiError.BadRequest("Cannot order the product")
        }

        return orderDto;
    }

    async takeAnOrder(userId, id) {
        const orderFound = await Order.findById(id);
        if(!orderFound || orderFound.waiter.toString() !== userId.toString()) {
            throw ApiError.BadRequest("Wrong order id");
        }

        if(orderFound.isTaken) {
            throw ApiError.BadRequest("This order is already taken")
        }
        const orderTaken = await Order.updateOne({
            _id: id
        }, {
            isTaken: true
        });

        const myOrdersDeleted = await User.updateOne({_id: userId}, {
            $pull: { myOrders: orderFound._id }
        })


        if(orderTaken.modifiedCount !== 1 || myOrdersDeleted.modifiedCount !== 1) {
            throw ApiError.BadRequest("Cannot take the product");
        }

        return orderTaken.modifiedCount === 1 && myOrdersDeleted.modifiedCount === 1;
    }

    async cancelOrder(userId, id) {
        const orderFound = await Order.findById(id);
        if(orderFound.waiter.toString() !== userId || !orderFound) {
            throw ApiError.BadRequest("Wrong order id");
        }
        const orderCanceled = await Order.updateOne({
            _id: id
        }, {
            canceled: false
        });

        return orderCanceled.modifiedCount === 1;
    }

    async

    async getPurchaseById(userId, id) {
        const purchase = await Purchase.findById(id);
        if (!purchase) {
            throw ApiError.notFound(404, "Purchase is not found");
        }
        const purchaseDto = new PurchaseDto(purchase);
        const user = await User.findById(userId);
        const purchaseInHistoryFound = user.purchasesHistory.find(i => i.toString() === purchase.id);
        if (!purchaseInHistoryFound) {
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