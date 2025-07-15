const { body ,param,query} = require('express-validator');
const {validatorMiddleware} = require('../../middlewares/validatorMiddleware'); // ✅ لاحظ الاسم
const{getcategoryByID}=require('../../models/categoryModel');
const{getSubCatByName}=require('../../models/subcategoryModel');
exports.postSubcategoryValidator = [
  body('categoryid').optional()
  .notEmpty().withMessage('categoryid is required')
  .isInt().withMessage('categoryid must be integer'),
  param('categoryid').custom(async(value)=>{
    const result= await getcategoryByID(value);
    if(result.recordset.length===0){
      throw new Error(`Category id ${value} not found`);
    }
    return true;
  })
  ,
  body('name')
    .notEmpty().withMessage('name is required')
    .isLength({ min: 2 }).withMessage('too short name').custom(async(value)=>{
      const result=await getSubCatByName(value);
      if(result.recordset.length >0){
      throw new Error(`Category name  ${value} is already Exists`);
    }
    return true;
    }),
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