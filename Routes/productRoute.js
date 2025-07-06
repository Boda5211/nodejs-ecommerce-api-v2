
const express = require('express');
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
  .get(GetProductBYID)
  .put(updateproduct)
  .delete(deleteproduct);

module.exports = router;
