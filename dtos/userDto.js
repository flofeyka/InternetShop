module.exports = class UserDto {
    id;
    name;
    email;
    image;
    ownProducts;
    createdAt;


    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.email = model.email;
        this.image = model.image;
        this.ownProducts = model.ownProducts;
        this.createdAt = model.createdAt;
    }
}