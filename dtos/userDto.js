module.exports = class UserDto {
    id;
    name;
    email;
    image;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.email = model.email;
        this.image = model.image;
    }
}