
const express = require('express');
const{ query,param,validationResult}=require('express-validator');
const {getcategoryValidator,putcategoryValidator}=require('../utils/validators/categoryValidator')
const subcategoryRouter=require('./subcategoryRoute');
const {
  savecategory,
  GetAllcategory,
  GetcategoryBYID,
  searchAboutcategory,
  updatecategory,
  deletecategory,resizeImag,uploadCategoryImg
} = require('../services/categoryServices');
const Authion=require('../services/authService');
const router = express.Router();

router.use('/:categoryid/subprod',subcategoryRouter);
// 🟢 أولًا: المسارات الثابتة
router.route('/')
  .post(Authion.protect,
    Authion.allowedTo('admin'),
    uploadCategoryImg,resizeImag,savecategory)
  .get(GetAllcategory);

router.get('/search', searchAboutcategory); // 🟢 قبل :id

// 🔵 ثانيًا: المسارات المعتمدة على ID
router.route('/:id')
    .get(getcategoryValidator,GetcategoryBYID)
  .put(Authion.protect,
    Authion.allowedTo('admin'),uploadCategoryImg,resizeImag,putcategoryValidator,updatecategory)
  .delete(Authion.protect,
    Authion.allowedTo('admin'),deletecategory);
module.exports = router;
