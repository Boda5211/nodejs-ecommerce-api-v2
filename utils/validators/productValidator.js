// utils/validators/productValidator.js

const { body, param } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// Create product validator
exports.createProductValidator = [
  body('title')
    .notEmpty().withMessage('Product title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

  body('description')
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),

  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt().withMessage('Quantity must be a number'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number'),

  body('category_ID')
    .notEmpty().withMessage('Category ID is required')
    .isInt().withMessage('Category ID must be a number'),
    body('priceAfterDiscount').optional().toFloat().custom((value,{req})=>{
        if(req.body.price <=value){

            throw new Error(`priceAfterDiscount must be lower than price`);
        }
        return true;
    }),
  validatorMiddleware
];

// Get product by ID validator
exports.getProductValidator = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isInt().withMessage('Product ID must be a number'),

  validatorMiddleware
];

// Update product validator
exports.updateProductValidator = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isInt().withMessage('Product ID must be a number'),

  body('title')
    .optional()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

  body('description')
    .optional()
    .isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),

  body('quantity')
    .optional()
    .isInt().withMessage('Quantity must be a number'),

  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number'),

  validatorMiddleware
];

// Delete product validator
exports.deleteProductValidator = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isInt().withMessage('Product ID must be a number'),

  validatorMiddleware
];
