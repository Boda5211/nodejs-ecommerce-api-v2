/*
const express=require('express');
const{saveproduct,GetAllProduct,GetProductBYID,
    searchAboutProduct,updateproduct
 ,deleteproduct}=require('../services/productServices');

const router =express.Router();

// router.post('/',saveproduct);
// router.get('/',GetAllProduct);
//anther way
router.route('/').post(saveproduct).get(GetAllProduct);
router.get('/search',searchAboutProduct);
router.put('/:id',updateproduct);
router.get('/:id',GetProductBYID);
router.delete('/:id',deleteproduct);
module.exports=router;

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

// المسارات الثابتة أولاً
router.route('/').post(saveproduct).get(GetAllProduct);
router.get('/search', searchAboutProduct);

// المسارات المعتمدة على ID بعدها
router.route('/:id')
      .get(GetProductBYID)
      .put(updateproduct)
      .delete(deleteproduct);

module.exports = router;
*/const express = require('express');
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
