const asyncHandler=require(`express-async-handler`);
const slugify=require('slugify');
const ApiError=require('../utils/apiError');
//const {sql , config}=require(`../config/database`);
//const {insertProduct,getAllProduct,getProductByID,searchAproduct}=require('../Models/productModel');
const {
  insertProduct,
  getAllProduct,
  getProductByID,
  searchAproduct,UpdateProduct,DeleteProduct
} = require('../models/productModel');
// @route post /
// @access public
exports.saveproduct=asyncHandler(async(req,res)=>{
    const {name}=req.body;
   if(!name){
    return res.status(400).json({error:'name is required'});

   }
   await insertProduct(name);
   res.status(201).json({message:'✔️ تمت الإضافة بنجاح'});
});

exports.GetAllProduct=asyncHandler(async(req,res)=>{
    const page=req.query.page *1 ||1;
    const limit=req.query.limit *1 || 5;
    //const skip=(page-1)*limit;
    const result =await getAllProduct(page,limit);
    res.status(200).json({page,limit,count:result.recordset.length,data:result.recordset});
});
// @route git /id
// @access public
//get product by id
exports.GetProductBYID =asyncHandler(async(req,res,next)=>{
    const id=req.params.id;
    if(isNaN(id)||!id){
       return next(new ApiError(`id ${id} not found`,400));
    }
    const result=await getProductByID(id);
     if(result.recordset.length === 0 )
         return res.status(404).json({error:'المنتج غير موجود'});
    res.status(200).json(result.recordset);
});
exports.searchAboutProduct = asyncHandler(async (req, res) => {
    const keyword = req.query.q?.trim(); // حذف المسافات والسطر الجديد

    // ✅ هنا مكان السطر اللي سألته عنه:
    if (!keyword) {
        return res.status(400).json({ error: 'كلمة البحث مطلوبة' });
    }

    const result = await searchAproduct(keyword);

    if (result.recordset.length < 1) {
        return res.status(404).json({ error: 'غير موجود' });
    }

    res.status(200).json(result.recordset);
});
exports.updateproduct=asyncHandler(async(req,res,next)=>{
    const id=parseInt(req.params.id);
    if(!id){
        return next(new ApiError(`id is not valid or found  ${id}`,400));
    }
    const { name }=req.body;
    
    if(!name){
        return res.status(400).json({error:'error'});
    }
   // const update= await UpdateProduct(id,name);
    const result= await UpdateProduct(id,name);

    if(!result){

        return res.status(404).json({error:'لم يتم التعرف'});
    }
    res.status(200).json({message:'done',data:result});
});
exports.deleteproduct=asyncHandler(async(req,res)=>{
    const id =parseInt(req.params.id);
    if(!id)
         return res.status(400).json({error:'not found'});
    const result= await DeleteProduct(id);
    if(result.rowsAffected[0]===0)
        return res.status(404).json({error:'No row Affrcted'});
    res.status(200).json({message:`Deleted ${id} successfully`});
});

