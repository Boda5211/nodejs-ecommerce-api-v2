// Routes/ProductsRoute.js

const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct, getAllProducts
} = require('../services/ProductsServices');

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator
} = require('../utils/validators/productValidator');

// عرض كل المنتجات
router.route('/')
 .get(getAllProducts)
  .post(createProductValidator, createProduct);

// عمليات على منتج محدد
router.route('/:id')
  .get(getProductValidator, getProduct)
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
