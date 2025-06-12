const express = require('express');
const { getProducts, saveproduct ,getProductByID} = require('../Controllers/productService');

const router = express.Router();

// POST /api/v1/product
router.post('/', saveproduct);

// GET /api/v1/product
router.get('/', getProducts);
router.route("/:id").get(getProductByID);
module.exports = router;
