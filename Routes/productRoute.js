
const express = require('express');
const{ query,param,validationResult}=require('express-validator');
const {getProductValidator,putProductValidator}=require('../utils/validators/productValidator')
const {
  saveproduct,
  GetAllProduct,
  GetProductBYID,
  searchAboutProduct,
  updateproduct,
  deleteproduct
} = require('../services/productServices');

const router = express.Router();

// 🟢 أولًا: المسارات الثابتة
router.route('/')
  .post(saveproduct)
  .get(GetAllProduct);

router.get('/search', searchAboutProduct); // 🟢 قبل :id

// 🔵 ثانيًا: المسارات المعتمدة على ID
router.route('/:id')
    .get(getProductValidator,GetProductBYID)
  .put(putProductValidator,updateproduct)
  .delete(deleteproduct);

module.exports = router;
