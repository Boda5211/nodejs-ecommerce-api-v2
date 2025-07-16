// Routes/ProductsRoute.js

const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct, getAllProducts,GetAllp,uploadproductImg,resizeProductImages
} = require('../services/ProductsServices');

const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator
} = require('../utils/validators/productValidator');
const Authion=require('../services/authService');

// عرض كل المنتجات
router.route('/')
 .get(getAllProducts)
  .post(Authion.protect,
    Authion.allowedTo('admin'),
    uploadproductImg,resizeProductImages,createProductValidator, createProduct);
router.route('//').get(GetAllp);
// عمليات على منتج محدد
router.route('/:id')
  .get(getProductValidator, getProduct)
  .put(Authion.protect,
    Authion.allowedTo('admin'),uploadproductImg,resizeProductImages,updateProductValidator, updateProduct)
  .delete(Authion.protect,
    Authion.allowedTo('admin'),deleteProductValidator, deleteProduct);

module.exports = router;
