const User = require("../models/User");
const Purchase = require("../models/Purchase");
const PurchaseDto = require("../dtos/purchaseDto");
const ApiError = require("../exceptions/api-error");
const Order = require("../models/Order");
const OrderDto = require("../dtos/orderDto")


module.exports = new class purchaseService {
    async editProduct(id, name, description, price, sort) {
        const updatedProduct = await Purchase.updateOne({ _id: id }, {
            name, description, price, sort
        });

        if (updatedProduct.modifiedCount === 1) {
            return new PurchaseDto(await Purchase.findById(id));
        }
    }

    async deleteProduct(userId, id) {
        const deletedProduct = await Purchase.findOneAndDelete({ _id: id });
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, {
            $pull: { ownProducts: deletedProduct._id }
        });
        await User.updateMany({}, {
            $pull: {
                cart: { id: deletedProduct._id }
            }
        });
        await User.updateMany({}, {
            $pull: {
                purchasesHistory: deletedProduct._id
            }
        });
        await User.updateMany({}, {
            $pull: {
                favourites: deletedProduct._id
            }
        })

        if (deletedProduct.modifiedCount === 1 && updatedUser.modifiedCount === 1) {
            return true;
        }
    }

    async getMyProducts(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.notFound("User is not found");
        }

        let productFound = []

        for (let i = 0; i < user.ownProducts.length; i++) {
            const product = await Purchase.findById(user.ownProducts[i])
            const productDto = new PurchaseDto(product);
            productFound.push(productDto);
        }

        return productFound;
    }

    async createProduct(userId, name, description, price, quantity, sort, image = "") {
        const user = await User.findById(userId);
        if (!user) {
            throw ApiError.notFound("User with this id is not found");
        }

        const newProduct = await Purchase.create({
            name,
            owner: userId,
            description,
            price,
            quantity,
            sort,
            image: !image ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS14NEov6BWo6r7ei-RJErEgj9Smnz6kyZMNQ&s" : image,
            viewsCount: 0,
            ordersCount: 0,
        });

        const userUpdated = await User.updateOne({ _id: userId }, {
            $push: { ownProducts: newProduct._id }
        })

        if (newProduct && userUpdated.modifiedCount === 1) {
            const ProductDto = new PurchaseDto(newProduct);
            return ProductDto;
        }
    }

    async getAll(sort = "popularity", search = "", page = 1, pageSize = 10) {

        let result = await Purchase.aggregate([
            {
                $sort: sort === "expensive" ? { price: -1 } : sort === "cheap" ? { price: 1 } : { viewsCount: -1 }
            },
            {
                $match: {
                    name: { $regex: search, $options: "i" }
                }
            }, {
                $facet: {
                    metaData: [
                        {
                            $count: "totalCount"
                        },
                        {
                            $addFields: {
                                pageNumber: page,
                                totalPages: { $ceil: { $divide: ["$totalCount", pageSize] } }
                            }
                        }
                    ],
                    data: [
                        {
                            $skip: (page - 1) * pageSize
                        },
                        {
                            $limit: pageSize,
                        }
                    ]
                }
            }
        ])

        result = result[0];
        result.metaData = { ...result.metaData[0], count: result.data.length };
        result.data = result.data.map(i => new PurchaseDto(i));
        return result;
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
        const clearHistory = await User.updateOne({ _id: id }, { purchasesHistory: [] });
        return clearHistory.modifiedCount === 1;
    }

    async HaveOrder(userId, id, orderCount, address, deadline) {
        const purchase = await Purchase.findById(id);
        if (!purchase) {
            throw ApiError.notFound("Purchase is not found");
        }
        if (purchase.ordersCount < orderCount) {
            throw ApiError.BadRequest("This product is less than count you want to order")
        }
        const purchaseQuantityModified = await Purchase.updateOne({ _id: id }, {
            quantity: purchase.quantity - orderCount
        })
        if (purchaseQuantityModified.modifiedCount !== 1) {
            throw ApiError.notFound("Cannot to order the purchase")
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
        const orderToOwner = await User.updateOne({ _id: user._id }, {
            $push: { ordersOnMyProducts: orderDto.id }
        });
        if (orderToOwner.modifiedCount !== 1) {
            throw ApiError.notFound("Cannot order the product");
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

        const purchaseOrderCountUpdated = await Purchase.updateOne({ _id: id }, {
            ordersCount: purchase.ordersCount + orderCount
        })

        if (orderToWaiter.modifiedCount !== 1 || purchaseOrderCountUpdated.modifiedCount !== 1) {
            throw ApiError.BadRequest("Cannot order the product")
        }

        return orderDto;
    }

    async takeAnOrder(userId, id) {
        const orderFound = await Order.findById(id);
        if (!orderFound || orderFound.waiter.toString() !== userId.toString()) {
            throw ApiError.BadRequest("Wrong order id");
        }

        if (orderFound.isTaken) {
            throw ApiError.BadRequest("This order is already taken")
        }
        const orderTaken = await Order.updateOne({
            _id: id
        }, {
            isTaken: true
        });

        const myOrdersDeleted = await User.updateOne({ _id: userId }, {
            $pull: { myOrders: orderFound._id }
        })


        if (orderTaken.modifiedCount !== 1 || myOrdersDeleted.modifiedCount !== 1) {
            throw ApiError.BadRequest("Cannot take the product");
        }

        return orderTaken.modifiedCount === 1 && myOrdersDeleted.modifiedCount === 1;
    }

    async cancelOrder(userId, id) {
        const orderFound = await Order.findById(id);
        if (orderFound.waiter.toString() !== userId || !orderFound) {
            throw ApiError.BadRequest("Wrong order id");
        }
        const orderCanceled = await Order.updateOne({
            _id: id
        }, {
            canceled: true
        });

        return orderCanceled.modifiedCount === 1;
    }


    async getPurchaseById(userId, id) {
        const purchase = await Purchase.findById(id);
        if (!purchase) {
            throw ApiError.notFound("Purchase is not found");
        }
        const purchaseDto = new PurchaseDto(purchase);
        const user = await User.findById(userId);
        const purchaseInHistoryFound = user.purchasesHistory.find(i => i.toString() === purchase.id);
        if (!purchaseInHistoryFound) {
            await User.updateOne({ _id: userId }, {
                $push: {
                    purchasesHistory: purchaseDto.id
                }
            });
            await Purchase.updateOne({ _id: id }, {
                viewsCount: purchase.viewsCount + 1
            })
        }
        return {
            ...purchaseDto, 
            owner: user.name
        }
    }
}