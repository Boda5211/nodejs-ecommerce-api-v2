
const express = require('express');
const{ query,param,validationResult}=require('express-validator');
const {getbrandsValidator,putbrandsValidator}=require('../utils/validators/brandsValidator')
const multer=require('multer');
const upload=multer({dest:'uploads/brands'});
const {
  savebrands,
  GetAllbrands,
  GetbrandsBYID,
  searchAboutbrands,
  updatebrands,
  deletebrands,uploadBrandImg,resizeImag,getlastid
} = require('../services/brandsServices');
const Authion=require('../services/authService');
const router = express.Router();
/*upload.single('img'),(req,res,next)=>{
    console.log(req.file);
    console.log(req.body);
    next();
  },*/
// 🟢 أولًا: المسارات الثابتة
//getlastid
router.route('/')
  .post(Authion.protect,
    Authion.allowedTo('admin')
    ,uploadBrandImg,resizeImag,savebrands)
  .get(GetAllbrands);
//http://localhost:9000/brands/brand-c9da6441-f8a8-4e3a-8584-41b02233c4f4-1752336685336.jpeg
router.get('/search', searchAboutbrands); // 🟢 قبل :id

// 🔵 ثانيًا: المسارات المعتمدة على ID
router.route('/:id')
    .get(getbrandsValidator,GetbrandsBYID)
  .put(Authion.protect,
    Authion.allowedTo('admin')
    ,uploadBrandImg,resizeImag,putbrandsValidator,updatebrands)
  .delete(Authion.protect,
    Authion.allowedTo('admin'),deletebrands);
module.exports = router;
