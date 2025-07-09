// services/productService.js
require('colors');
const asyncHandler = require('express-async-handler');
const { insertProduct, getProductById, updateProduct, deleteProduct ,getAllProducts} = require('../models/productsModel');
const ApiError = require('../utils/apiError');

// @desc    Create new product
// @route   POST /products
exports.createProduct = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const result = await insertProduct(data);
  res.status(201).json({ message: 'Product created successfully', data: result.recordset });
});

// @desc    Get product by ID
// @route   GET /products/:id
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await getProductById(id);
  if (result.recordset.length === 0) {
    return next(new ApiError(`Product not found with id ${id}`, 404));
  }
  res.status(200).json(result.recordset[0]);
});

// @desc    Update product by ID
// @route   PUT /products/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const result = await updateProduct(id, data);
  if (result.rowsAffected[0] === 0) {
    return next(new ApiError(`No product updated with id ${id}`, 404));
  }
  res.status(200).json({ message: 'Product updated successfully' });
});

// @desc    Delete product by ID
// @route   DELETE /products/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await deleteProduct(id);
  if (result.rowsAffected[0] === 0) {
    return next(new ApiError(`No product deleted with id ${id}`, 404));
  }
  res.status(204).json({ message: 'Product deleted successfully' });
});
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const page=req.query.page || 1;
  const limit=req.query.limit || 3;
  const queryStringobj={...req.query};
  const excludesFilds=['page','limit'];
  excludesFilds.forEach((field)=>delete queryStringobj[field]);
  console.log(queryStringobj);
  console.log(req.query);
  const result = await getAllProducts(page,limit);
  let data=result.recordset;
  data=data.map(prod =>{
    const {colors,images,ratingsQuantity, ...filtered}=prod;
    return filtered;
  });
  res.status(200).json({ count: data.length, data: data });
});