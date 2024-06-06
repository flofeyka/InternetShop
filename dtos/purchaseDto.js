module.exports = class PurchaseDto {
    id;
    name;
    description;
    viewsCount;
    ordersCount;
    owner;
    price;
    quantity;
    image;
    sort;

    constructor(model) {
        this.id = model._id;
        this.name = model.name;
        this.description = model.description;
        this.ordersCount = model.ordersCount;
        this.viewsCount = model.viewsCount;
        this.owner = model.owner;
        this.price = model.price;
        this.quantity = model.quantity;
        this.image = model.image;
        this.sort = model.sort;
    }
}