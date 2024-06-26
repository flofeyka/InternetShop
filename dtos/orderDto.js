module.exports = class OrderDto {
    id;
    productId;
    waiter;
    name;
    phoneNumber;
    waiterName;
    isTaken;
    isVerified;
    email;
    image;
    finalPrice;
    canceled;
    address;
    isVerified;
    createdAt;

    constructor(model) {
        this.id = model.order._id;
        this.name = model.product.name,
        this.productId = model.order.productId;
        this.image = model.product.image;
        this.address = model.order.address;
        this.waiterName = model.user.waiterName,
        this.phoneNumber = model.user.phoneNumber,
        this.email = model.user.email;
        this.waiter = model.order.waiter;
        this.isTaken = model.order.isTaken;
        this.isVerified = model.order.isVerified;
        this.canceled = model.order.canceled;
        this.finalPrice = model.order.finalPrice;
        this.count = model.order.count;
        this.isVerified = model.order.isVerified;
        this.createdAt = model.order.createdAt;
    }
}