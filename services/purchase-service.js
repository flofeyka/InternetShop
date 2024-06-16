const User = require("../models/User");
const Purchase = require("../models/Purchase");
const PurchaseDto = require("../dtos/purchaseDto");
const ApiError = require("../exceptions/api-error");
const Order = require("../models/Order");
const OrderDto = require("../dtos/orderDto");
const Uuid = require("uuid");
module.exports = new (class purchaseService {
  async editProduct(id, name, description, price, sort, quantity) {
    const updatedProduct = await Purchase.updateOne(
      { _id: id },
      {
        name,
        description,
        price,
        sort,
        quantity,
      }
    );

    if (updatedProduct.modifiedCount === 1) {
      return new PurchaseDto(await Purchase.findById(id));
    }
  }

  async editProductImage(file, id) {
    const product = await Purchase.findById(id);
    const imageName = Uuid.v4() + ".jpg";
    file.mv(process.env.staticPath + "\\" + imageName);
    product.image = imageName;
    product.save();
  }


  async deleteProduct(userId, id) {
    const deletedProduct = await Purchase.findOneAndDelete({ _id: id });
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { ownProducts: deletedProduct._id },
      }
    );
    await User.updateMany(
      {},
      {
        $pull: {
          cart: { id: deletedProduct._id },
        },
      }
    );
    await User.updateMany(
      {},
      {
        $pull: {
          purchasesHistory: deletedProduct._id,
        },
      }
    );
    await User.updateMany(
      {},
      {
        $pull: {
          favourites: deletedProduct._id,
        },
      }
    );

    if (deletedProduct.modifiedCount === 1 && updatedUser.modifiedCount === 1) {
      return deletedProduct;
    }
  }

  async getMyProducts() {
    const products = await Purchase.find({});
    let amountOfProducts = 0;
    const data = products.map((product) => {
      amountOfProducts = +product.price;
      return new PurchaseDto(product);
    });

    return {
      totalCount: products.length,
      amountOfProducts,
      data,
    };
  }

  async createProduct(
    userId,
    name,
    description,
    price,
    quantity,
    sort,
    image = ""
  ) {
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
      image,
      viewsCount: 0,
      ordersCount: 0,
    });

    const userUpdated = await User.updateOne(
      { _id: userId },
      {
        $push: { ownProducts: newProduct._id },
      }
    );

    if (newProduct && userUpdated.modifiedCount === 1) {
      const ProductDto = new PurchaseDto(newProduct);
      return ProductDto;
    }
  }

  async getAll(sort = "popularity", search = "", page = 1, pageSize = 10) {
    let result = await Purchase.aggregate([
      {
        $sort:
          sort === "expensive"
            ? { price: -1 }
            : sort === "cheap"
            ? { price: 1 }
            : { viewsCount: -1 },
      },
      {
        $match: {
          name: { $regex: search, $options: "i" },
        },
      },
      {
        $facet: {
          metaData: [
            {
              $count: "totalCount",
            },
            {
              $addFields: {
                pageNumber: page,
                totalPages: { $ceil: { $divide: ["$totalCount", pageSize] } },
              },
            },
          ],
          data: [
            {
              $skip: (page - 1) * pageSize,
            },
            {
              $limit: pageSize,
            },
          ],
        },
      },
    ]);

    result = result[0];
    result.metaData = { ...result.metaData[0], count: result.data.length };
    result.data = result.data.map((i) => new PurchaseDto(i));
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
    const clearHistory = await User.updateOne(
      { _id: id },
      { purchasesHistory: [] }
    );
    return clearHistory.modifiedCount === 1;
  }

  async getPurchaseById(userId, id) {
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      throw ApiError.notFound("Purchase is not found");
    }
    const purchaseDto = new PurchaseDto(purchase);
    const user = await User.findById(userId);
    const purchaseInHistoryFound = user.purchasesHistory.find(
      (i) => i.toString() === purchase.id
    );
    if (!purchaseInHistoryFound) {
      await User.updateOne(
        { _id: userId },
        {
          $push: {
            purchasesHistory: purchaseDto.id,
          },
        }
      );
      await Purchase.updateOne(
        { _id: id },
        {
          viewsCount: purchase.viewsCount + 1,
        }
      );
    }
    return {
      ...purchaseDto,
      owner: user.name,
    };
  }
})();
