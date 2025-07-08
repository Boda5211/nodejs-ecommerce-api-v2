const { body ,param,query} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware'); // ✅ لاحظ الاسم

exports.postSubcategoryValidator = [
  body('name')
    .notEmpty().withMessage('name is required')
    .isLength({ min: 2 }).withMessage('too short name'),
  body('categoryid')
    .notEmpty().withMessage('categoryid is required')
    .isInt().withMessage('categoryid must be integer'),
  validatorMiddleware
];
exports.getSubcategorybyidValidator=[
  param('id').notEmpty().withMessage('id is required to search')
  .isInt().withMessage('id must be integer'),
  validatorMiddleware
]
exports.getallSubcategoryValidator=[
  query('page').optional().isInt().withMessage('اختار رقم الصفحه صحيح'),
  query('limit').isInt().withMessage('اختار limit صحيح').optional(),
  validatorMiddleware
]
exports.putsubprodutValidator=[
  param('id').notEmpty().withMessage('id is required to search')
  .isInt().withMessage('id must be integer'),
  body('name')
    .notEmpty().withMessage('name is required')
    .isLength({ min: 2 }).withMessage('too short name'),
  body('categoryid')
    .notEmpty().withMessage('categoryid is required')
    .isInt().withMessage('categoryid must be integer'),validatorMiddleware
]