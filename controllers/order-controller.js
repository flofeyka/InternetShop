const orderService = require("../services/order-service");


module.exports = new (class orderController {
  async getUserOrders(req, res, next) {
    try {
      const ordersFound = await orderService.getOrders(req.user.id, req.query.sort);
      return res.json(ordersFound);
    } catch(e) {
      next(e);
    }
  }

  // async getMyOrders(req, res, next) {
  //   try {
  //     const ordersFound = await orderService.getMyOrders(req.user.id);
  //     return res.json(ordersFound);
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  // async getNotVerifiedOrders(req, res, next) {
  //   try {
  //       const ordersFound = await orderService.getNotVerifiedOrders();
  //       return res.json(ordersFound);
  //   } catch(e) {
  //       next(e);
  //   }
  // }

  async verifyOrder(req, res, next) {
    try {
        const verifiedOrder = await orderService.verifyOrder(req.params.id);
        return res.json(verifiedOrder);
    } catch(e) {
        next(e);
    }
  }

  async Order(req, res, next) {
    try {
      const { products, payment, address } = req.body;
      const newOrder = await orderService.HaveOrder(
        req.user.id,
        products,
        address,
        payment
      );
      return res.json(newOrder);
    } catch (e) {
      next(e);
    }
  }

  // async getOrders(req, res, next) {
  //   try {
  //     const orders = await orderService.getNotTakenOrders();
  //     return res.json(orders);
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  async takeAnOrder(req, res, next) {
    try {
      const isTakenOrder = await orderService.takeAnOrder(
        req.user.id,
        req.params.id
      );
      return res
        .status(isTakenOrder ? 200 : 500)
        .json(200 && "The order is successfully taken");
    } catch (e) {
      next(e);
    }
  }

  // async getTakenOrders(req, res, next) {
  //   try {
  //       const takenOrders = await orderService.getTakenOrders(req.user.id);
  //       return res.json(takenOrders);
  //   } catch(e) {
  //       next(e);
  //   }
  // }

  async cancelOrder(req, res, next) {
    try {
      const isOrderCanceled = await orderService.cancelOrder(
        req.user.id,
        req.params.id
      );
      return res
        .status(isOrderCanceled ? 200 : 500)
        .json(isOrderCanceled && "The order is successfully cancelled");
    } catch (e) {
      next(e);
    }
  }
})();
