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
        this.id = model._id;
        this.name = model.name,
        this.productId = model.productId;
        this.image = model.image;
        this.address = model.address;
        this.waiterName = model.waiterName,
        this.phoneNumber = model.phoneNumber,
        this.email = model.email;
        this.waiter = model.waiter;
        this.isTaken = model.isTaken;
        this.isVerified = model.isVerified;
        this.canceled = model.canceled;
        this.finalPrice = model.finalPrice;
        this.count = model.count;
        this.isVerified = model.isVerified;
        this.createdAt = model.createdAt;
    }
}