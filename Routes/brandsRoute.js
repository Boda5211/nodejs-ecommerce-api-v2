
const express = require('express');
const{ query,param,validationResult}=require('express-validator');
const {getbrandsValidator,putbrandsValidator}=require('../utils/validators/brandsValidator')

const {
  savebrands,
  GetAllbrands,
  GetbrandsBYID,
  searchAboutbrands,
  updatebrands,
  deletebrands
} = require('../services/brandsServices');

const router = express.Router();

// 🟢 أولًا: المسارات الثابتة
router.route('/')
  .post(savebrands)
  .get(GetAllbrands);

router.get('/search', searchAboutbrands); // 🟢 قبل :id

// 🔵 ثانيًا: المسارات المعتمدة على ID
router.route('/:id')
    .get(getbrandsValidator,GetbrandsBYID)
  .put(putbrandsValidator,updatebrands)
  .delete(deletebrands);
module.exports = router;
