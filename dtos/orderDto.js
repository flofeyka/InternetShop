module.exports = class OrderDto {
    id;
    purchaseId;
    waiter;
    finalPrice;
    createdAt;

    constructor(model) {
        this.id = model._id;
        this.purchaseId = model.purchaseId;
        this.waiter = model.waiter;
        this.finalPrice = model.finalPrice;
        this.createdAt = model.createdAt;
    }
}