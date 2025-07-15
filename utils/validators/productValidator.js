// utils/validators/productValidator.js

const { body, param } = require('express-validator');
const {validatorMiddleware} = require('../../middlewares/validatorMiddleware');
const{getcategoryByID}=require('../../models/categoryModel');
const{getSubcategoryBYIDM,getSubcatBYIDand_catidM}=require('../../models/subcategoryModel');
const{getbrandsByID}=require('../../models/brandsModel');
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
    .isInt().withMessage('Category ID must be a number').custom(async(value)=>{
       const result=await getcategoryByID(value);
       if(result.recordset.length===0){
        throw new Error(`category ${value} not found `);
       }
       return true;
    }),
    body('subcategory_ID').notEmpty().withMessage(`subcategory must by declare `)
    .isInt().custom(async(subcategory_ID,{req})=>{
            //const result=await getSubcategoryBYIDM(value);
      const category_ID=req.body.category_ID;
      const result=await getSubcatBYIDand_catidM(subcategory_ID,category_ID);
      if(result.recordset.length===0){
        throw new Error(`subCategory id ${subcategory_ID} does not belong to Category ${category_ID}`);
      }
      return true;
    }),
    body('Arrayof_Subcategory').optional()//.isArray({min:1}).withMessage(`Arrayof_Subcategory must be a non-empty array`)
    .custom(async(value,{req})=>{
      const arr=Array.isArray(value)?value:[value];
      const category_ID=req.body.category_ID;
      const uniqueSet=new Set(arr);
      if(uniqueSet.size !==arr.length){
         throw new Error('Arrayof_Subcategory must not contain duplicate IDs');
      }
      for (const id of arr) {
        if(!Number.isInteger(id)){
            throw new Error (`Each subcategory id must be an integer`);
        }
         const result=await getSubcatBYIDand_catidM(id,category_ID);
        if (result.recordset.length === 0) {
          throw new Error(`subCategory id ${id} does not belong to Category ${category_ID}`);
        }
      }
      return true;
    })
    ,
    body('priceAfterDiscount').optional().toFloat().custom((value,{req})=>{
        if(req.body.price <=value){

            throw new Error(`priceAfterDiscount must be lower than price`);
        }
        return true;
    }),
    body('brand_ID').notEmpty().isInt().custom(async(value)=>{
      const result=await getbrandsByID(value);
      if(result.recordset.length===0){
        throw new Error(`brand_ID ${value} is not avalowal`);
      }
      return true;
    })
    ,
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
    body('category_ID').optional()
    .notEmpty().withMessage('Category ID is required')
    .isInt().withMessage('Category ID must be a number').custom(async(value)=>{
       const result=await getcategoryByID(value);
       if(result.recordset.length===0){
        throw new Error(`category ${value} not found `);
       }
       return true;
    }),
    body('subcategory_ID').optional().notEmpty().withMessage(`subcategory must by declare `)
    .isInt().custom(async(subcategory_ID,{req})=>{
            //const result=await getSubcategoryBYIDM(value);
      const category_ID=req.body.category_ID;
      const result=await getSubcatBYIDand_catidM(subcategory_ID,category_ID);
      if(result.recordset.length===0){
        throw new Error(`subCategory id ${subcategory_ID} does not belong to Category ${category_ID}`);
      }
      return true;
    }),
    body('Arrayof_Subcategory').optional()//.isArray({min:1}).withMessage(`Arrayof_Subcategory must be a non-empty array`)
    .custom(async(value,{req})=>{
      const arr=Array.isArray(value)?value:[value];
      const category_ID=req.body.category_ID;
      const uniqueSet=new Set(arr);
      if(uniqueSet.size !==arr.length){
         throw new Error('Arrayof_Subcategory must not contain duplicate IDs');
      }
      for (const id of arr) {
        if(!Number.isInteger(id)){
            throw new Error (`Each subcategory id must be an integer`);
        }
         const result=await getSubcatBYIDand_catidM(id,category_ID);
        if (result.recordset.length === 0) {
          throw new Error(`subCategory id ${id} does not belong to Category ${category_ID}`);
        }
      }
      return true;
    })
    ,
    body('priceAfterDiscount').optional().toFloat().custom((value,{req})=>{
        if(req.body.price <=value){

            throw new Error(`priceAfterDiscount must be lower than price`);
        }
        return true;
    }),
    body('brand_ID').optional().notEmpty().isInt().custom(async(value)=>{
      const result=await getbrandsByID(value);
      if(result.recordset.length===0){
        throw new Error(`brand_ID ${value} is not avalowal`);
      }
      return true;
    }),
  validatorMiddleware
];

// Delete product validator
exports.deleteProductValidator = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isInt().withMessage('Product ID must be a number'),

  validatorMiddleware
];
