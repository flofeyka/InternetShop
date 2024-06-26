const purchaseService = require("../services/purchase-service");

module.exports = new (class purchaseController {
  async editProductImage(req, res, next) {
    try {
      const edited = await purchaseService.editProductImage(req.files.file, req.params.id);
      return res.json(edited);
    } catch(e) {
      next(e);
    }
  }

  async parseProducts(req, res, next) {
    try {
      const productsParsed = await purchaseService.parseProducts(req.files.file);
      return res.json(productsParsed); 
    } catch(e) {
      next(e);
    }
  }
  
  async editProduct(req, res, next) {
    try {
      const { name, description, price, sort, quantity } = req.body;
      const productEdited = await purchaseService.editProduct(
        req.params.id,
        name,
        description,
        price,
        sort,
        quantity,
      );
      return res.status(productEdited ? 200 : 400).json(productEdited);
    } catch (e) {
      next(e);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const deletedProduct = await purchaseService.deleteProduct(
        req.user.id,
        req.params.id
      );
      res.status(deletedProduct ? 200 : 400).json(deletedProduct);
    } catch (e) {
      next(e);
    }
  }

  async getMyProducts(req, res, next) {
    try {
      const myProducts = await purchaseService.getMyProducts(req.user.id);
      return res.json(myProducts);
    } catch (e) {
      next(e);
    }
  }

  async createProduct(req, res, next) {
    try {
      const { name, description, price, sort, quantity } = req.body;
      const createdProduct = await purchaseService.createProduct(
        req.user.id,
        name,
        description,
        price,
        quantity,
        sort
      );
      return res.status(createdProduct ? 200 : 400).json(createdProduct);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const { search, sort, page, pageSize } = req.query;
      const purchases = await purchaseService.getAll(
        sort,
        search,
        Number(page),
        Number(pageSize)
      );
      return res.json(purchases);
    } catch (e) {
      next(e);
    }
  }

  async getHistory(req, res, next) {
    try {
      const purchases = await purchaseService.getHistory(req.user.id);
      return res.json(purchases);
    } catch (e) {
      next(e);
    }
  }

  async getOneById(req, res, next) {
    try {
      const purchase = await purchaseService.getPurchaseById(
        req.user.id,
        req.params.id
      );
      return res.json(purchase);
    } catch (e) {
      next(e);
    }
  }

  async clearHistory(req, res, next) {
    try {
      const isDeletedHistory = await purchaseService.clearHistory(req.user.id);
      return res.json(isDeletedHistory);
    } catch (e) {
      next(e);
    }
  }
})();
