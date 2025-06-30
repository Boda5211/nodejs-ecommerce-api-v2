const express=require('express');
const{saveproduct}=require('../services/productServices');

const router =express.Router();

router.post('/',saveproduct);

module.exports=router;