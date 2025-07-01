const express=require('express');
const{saveproduct,GetAllProduct,GetProductBYID,searchAboutProduct,updateproduct}=require('../services/productServices');

const router =express.Router();

router.post('/',saveproduct);
router.put('/:id',updateproduct);
router.get('/',GetAllProduct);
router.get('/search',searchAboutProduct);
router.get('/:id',GetProductBYID);
module.exports=router;