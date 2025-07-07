const asyncHandler=require('express-async-handler');
const{insertSubProduct}=require('../models/subproductModel');
const Apierror=require('../utils/apiError');

exports.createSubProduct=asyncHandler(async(req,res)=>{
    const {name,productid}=req.body;
    const resutl=insertSubProduct(name,productid);
    res.status(200).json({message:'down'});
})