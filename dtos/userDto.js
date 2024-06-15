module.exports = class UserDto {
    id;
    name;
    email;
    image;
    gender;
    isOwner;
    ownProducts;
    createdAt;


    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.email = model.email;
        this.isOwner = model.isOwner;
        this.gender = model.gender;
        this.image = model.image;
        this.ownProducts = model.ownProducts;
        this.createdAt = model.createdAt;
    }
}