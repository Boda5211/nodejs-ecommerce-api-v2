const asyncHandler=require(`express-async-handler`);
//const {sql , config}=require(`../config/database`);
const {insertCategory}=require('../models/productModel');

exports.saveproduct=asyncHandler(async(req,res)=>{
    const {name}=req.body;
   if(!name){
    return res.status(400).json({error:'name is required'});

   }
   await insertCategory(name);
   res.status(201).json({message:'✔️ تمت الإضافة بنجاح'});
});