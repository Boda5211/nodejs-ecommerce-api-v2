
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
  deletecategory
} = require('../services/categoryServices');

const router = express.Router();

router.use('/:categoryid/subprod',subcategoryRouter);
// 🟢 أولًا: المسارات الثابتة
router.route('/')
  .post(savecategory)
  .get(GetAllcategory);

router.get('/search', searchAboutcategory); // 🟢 قبل :id

// 🔵 ثانيًا: المسارات المعتمدة على ID
router.route('/:id')
    .get(getcategoryValidator,GetcategoryBYID)
  .put(putcategoryValidator,updatecategory)
  .delete(deletecategory);
module.exports = router;
