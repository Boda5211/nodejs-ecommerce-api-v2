const express = require('express');
const { getProducts, saveproduct ,getProductByID,
    createProduct,UpdateProduct} = require('../Controllers/productService');

const router = express.Router();

// POST /api/v1/product   //, saveproduct
router.post('/',createProduct);

// GET /api/v1/product
router.get('/', getProducts);
router.route("/:id").get(getProductByID).put(UpdateProduct);
module.exports = router;
