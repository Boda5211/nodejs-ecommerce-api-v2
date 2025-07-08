const asyncHandler=require(`express-async-handler`);

const ApiError=require('../utils/apiError');
//const {sql , config}=require(`../config/database`);
//const {insertbrands,getAllbrands,getbrandsByID,searchAbrands}=require('../Models/brandsModel');
const {
  insertbrands,
  getAllbrands,
  getbrandsByID,
  searchAbrands,Updatebrands,Deletebrands
} = require('../models/brandsModel');
// @route post /
// @access public
exports.savebrands=asyncHandler(async(req,res)=>{
    const {name}=req.body;
   if(!name){
    return res.status(400).json({error:'name is required'});

   }
   await insertbrands(name);
   res.status(201).json({message:'✔️ تمت الإضافة بنجاح'});
});

exports.GetAllbrands=asyncHandler(async(req,res)=>{
    const page=req.query.page *1 ||1;
    const limit=req.query.limit *1 || 5;
    //const skip=(page-1)*limit;
    const result =await getAllbrands(page,limit);
    res.status(200).json({page,limit,count:result.recordset.length,data:result.recordset});
});
// @route git /id
// @access public
//get brands by id
exports.GetbrandsBYID =asyncHandler(async(req,res,next)=>{
    const id=req.params.id;
    if(isNaN(id)||!id){
       return next(new ApiError(`id ${id} not found`,400));
    }
    const result=await getbrandsByID(id);
     if(result.recordset.length === 0 )
         return res.status(404).json({error:'المنتج غير موجود'});
    res.status(200).json(result.recordset);
});
exports.searchAboutbrands = asyncHandler(async (req, res) => {
    const keyword = req.query.q?.trim(); // حذف المسافات والسطر الجديد

    // ✅ هنا مكان السطر اللي سألته عنه:
    if (!keyword) {
        return res.status(400).json({ error: 'كلمة البحث مطلوبة' });
    }

    const result = await searchAbrands(keyword);

    if (result.recordset.length < 1) {
        return res.status(404).json({ error: 'غير موجود' });
    }

    res.status(200).json(result.recordset);
});
exports.updatebrands=asyncHandler(async(req,res,next)=>{
    const id=parseInt(req.params.id);
    if(!id){
        return next(new ApiError(`id is not valid or found  ${id}`,400));
    }
    const { name }=req.body;
    
    if(!name){
        return res.status(400).json({error:'error'});
    }
   // const update= await Updatebrands(id,name);
    const result= await Updatebrands(id,name);

    if(!result){

        return res.status(404).json({error:'لم يتم التعرف'});
    }
    res.status(200).json({message:'done',data:result});
});
exports.deletebrands=asyncHandler(async(req,res)=>{
    const id =parseInt(req.params.id);
    if(!id)
         return res.status(400).json({error:'not found'});
    const result= await Deletebrands(id);
    if(result.rowsAffected[0]===0)
        return res.status(404).json({error:'No row Affrcted'});
    res.status(200).json({message:`Deleted ${id} successfully`});
});

