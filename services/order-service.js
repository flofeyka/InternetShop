const OrderDto = require("../dtos/orderDto");
const PurchaseDto = require("../dtos/purchaseDto");
const ApiError = require("../exceptions/api-error");
const Order = require("../models/Order");
const Purchase = require("../models/Purchase");
const User = require("../models/User");

module.exports = new (class orderService {
  async HaveOrder(userId, products, address, payment) {
    let orders = [];

    for (let i = 0; i < products.length; i++) {
      const purchase = await Purchase.findById(products[i].id);
      if (!purchase) {
        throw ApiError.notFound("Purchase is not found");
      }
      if (purchase.quantity < products[i].count) {
        throw ApiError.BadRequest(
          "This product is less than count you want to order"
        );
      }
      const purchaseQuantityModified = await Purchase.updateOne(
        { _id: products[i].id },
        {
          quantity: purchase.quantity - products[i].count,
        }
      );
      if (purchaseQuantityModified.modifiedCount !== 1) {
        throw ApiError.notFound("Cannot order the purchase");
      }

      const purchaseOrderCountUpdated = await Purchase.updateOne(
        { _id: purchase._id },
        {
          ordersCount: purchase.ordersCount + products[i].count,
        }
      );

      if (purchaseOrderCountUpdated.modifiedCount !== 1) {
        throw ApiError.BadRequest("Cannot order the purchase");
      }


      const order = await Order.create({
        productId: products[i].id,
        waiter: userId,
        finalPrice: products[i].count * purchase.price,
        address: {
          city: address.city,
          street: address.street,
          entrance: address.entrance,
          ...address,
        },
        canceled: false,
        isTaken: false,
        isVerified: false,
        payment,
        createdAt: Date.now(),
      });

      const orderDto = new OrderDto(order);

      const user = await User.findById(purchase.owner);
      const orderToOwner = await User.updateOne(
        { _id: user._id },
        {
          $push: { ordersOnMyProducts: orderDto.id },
        }
      );
      if (orderToOwner.modifiedCount !== 1) {
        throw ApiError.notFound("Cannot order the product");
      }
      const waiter = await User.findById(userId);
      if (!waiter) {
        throw ApiError.BadRequest(`User with id ${userId} is not found`);
      }
      const orderToWaiter = await User.updateOne(
        {
          _id: userId,
        },
        {
          $push: {
            myOrders: orderDto.id,
          },
        }
      );

      if (orderToWaiter.modifiedCount !== 1) {
        throw ApiError.BadRequest("Cannot order the product");
      }

      orders.push(orderDto);
    }

    return orders;
  }

  async verifyOrder(id) {
    const orderFound = await Order.findOne({ _id: id, isVerified: false });
    orderFound.isVerified = true;
    await orderFound.save();
    return orderFound;
  }

  async getNotVerifiedOrders() {
    const orders = await Order.find({ isVerified: false, canceled: false });
    const orderList = [];

    for (let i = 0; i < orders.length; i++) {
      const product = await Purchase.findById(orders[i].productsData.id);
      const productDto = new PurchaseDto(product);
      const user = await User.findById(orders[i].waiter);
      const orderDto = new OrderDto({
        _id: orders[i]._id,
        count: orders[i].productsData.count,
        productId: orders[i].productsData.id,
        address: orders[i].address,
        waiterName: user.name,
        phoneNumber: user.phoneNumber,
        isTaken: orders[i].isTaken,
        isVerified: orders[i].isVerified,
        email: user.email,
        finalPrice: orders[i].finalPrice,
        ...productDto,
        ...orders[i],
      });
      orderList.push(orderDto);
    }

    return orderList;
  }

  async getOrders(userId, sort) {
    const user = await User.findById(userId);
    if(!user) {
      throw ApiError.unAuthorizedError();
    }
    let orders = [];
    switch (sort) {
      case "notVerified":
        orders = user.isOwner ? await Order.find({ isVerified: false, canceled: false }) : [];
        break;
      case "takenOrders":
        orders = user.isOwner ? await Order.find({ isTaken: true, waiter: userId }) : [];
        break;
      case "notTakenOrders":
        orders = user.isOwner ? await Order.find({ isTaken: false, canceled: false, isVerified: true }) : [];
        break;
      case "mineOrders":
        orders = await Order.find({ waiter: userId });
        break;
      default:
        orders = await Order.find({});
        break;
    }
    return Promise.all(orders.map(async order => {
      const product = await Purchase.findById(order.productId);
      const user = await User.findById(order.waiter);
      const orderDto = new OrderDto({order, product, user});
      return orderDto;
    }));
  }

  async takeAnOrder(userId, id) {
    const orderFound = await Order.findById(id);
    if (!orderFound || orderFound.waiter.toString() !== userId.toString()) {
      throw ApiError.BadRequest("Wrong order id");
    }

    if (orderFound.isTaken) {
      throw ApiError.BadRequest("This order is already taken");
    }
    const orderTaken = await Order.updateOne(
      {
        _id: id,
      },
      {
        isTaken: true,
      }
    );

    const myOrdersDeleted = await User.updateOne(
      { _id: userId },
      {
        $pull: { myOrders: orderFound._id },
      }
    );

    if (orderTaken.modifiedCount !== 1 || myOrdersDeleted.modifiedCount !== 1) {
      throw ApiError.BadRequest("Cannot take the product");
    }

    return (
      orderTaken.modifiedCount === 1 && myOrdersDeleted.modifiedCount === 1
    );
  }

  async cancelOrder(userId, id) {
    const orderFound = await Order.findById(id);
    const user = await User.findById(userId);
    if (orderFound.waiter.toString() !== userId && user.isOwner !== true || !orderFound) {
      throw ApiError.BadRequest("Wrong order id");
    }
    const orderCanceled = await Order.updateOne(
      {
        _id: id,
      },
      {
        canceled: true,
      }
    );

    return orderCanceled.modifiedCount === 1;
  }
})();
