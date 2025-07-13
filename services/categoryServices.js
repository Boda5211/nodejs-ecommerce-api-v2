const asyncHandler=require(`express-async-handler`);
const hanlerFact=require('./handlersFactory');
const ApiError=require('../utils/apiError');
const {uploadSingleImage}=require('../middlewares/uploadImageMiddleware');
const {v4:uuidv4}=require('uuid');
const sharp=require('sharp');
const {
  insertcategory,
  getAllcategory,
  getcategoryByID,
  searchAcategory,Updatecategory,Deletecategory
} = require('../models/categoryModel');
// @route post /
// @access public
/*exports.savecategory=asyncHandler(async(req,res)=>{
    const {name}=req.body;
   if(!name){
    return res.status(400).json({error:'name is required'});

   }
   await insertcategory(name);
   res.status(201).json({message:'✔️ تمت الإضافة بنجاح'});
});*/
exports.uploadCategoryImg=uploadSingleImage('image');
exports.resizeImag=asyncHandler(async(req,res,next)=>{
    if(!req.file || !req.file.buffer){
        return next();
    }
    const filename=`category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
    .resize(400,400)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/category/${filename}`);
    req.body.image=filename;
    next();
})
exports.savecategory=hanlerFact.cerateOne(insertcategory);
exports.GetAllcategory=hanlerFact.getAll(getAllcategory);
/*asyncHandler(async(req,res)=>{
    const page=req.query.page *1 ||1;
    const limit=req.query.limit *1 || 5;
    //const skip=(page-1)*limit;
    const result =await getAllcategory(page,limit);
    res.status(200).json({page,limit,count:result.recordset.length,data:result.recordset});
});*/
// @route git /id
// @access public
//get category by id
exports.GetcategoryBYID =hanlerFact.GetOneById(getcategoryByID);
/*asyncHandler(async(req,res,next)=>{
    const id=req.params.id;
    if(isNaN(id)||!id){
       return next(new ApiError(`id ${id} not found`,400));
    }
    const result=await getcategoryByID(id);
     if(result.recordset.length === 0 )
         return res.status(404).json({error:'المنتج غير موجود'});
    res.status(200).json(result.recordset);
});*/
exports.searchAboutcategory = asyncHandler(async (req, res) => {
    const keyword = req.query.q?.trim(); // حذف المسافات والسطر الجديد

    // ✅ هنا مكان السطر اللي سألته عنه:
    if (!keyword) {
        return res.status(400).json({ error: 'كلمة البحث مطلوبة' });
    }

    const result = await searchAcategory(keyword);

    if (result.recordset.length < 1) {
        return res.status(404).json({ error: 'غير موجود' });
    }

    res.status(200).json(result.recordset);
});
exports.updatecategory=hanlerFact.updateOne(Updatecategory);
/*
exports.updatecategory=asyncHandler(async(req,res,next)=>{
    const id=parseInt(req.params.id);
    if(!id){
        return next(new ApiError(`id is not valid or found  ${id}`,400));
    }
    const { name }=req.body;
    
    if(!name){
        return res.status(400).json({error:'error'});
    }
   // const update= await Updatecategory(id,name);
    const result= await Updatecategory(id,name);

    if(!result){

        return res.status(404).json({error:'لم يتم التعرف'});
    }
    res.status(200).json({message:'done',data:result});
});*/
// exports.deletecategory=asyncHandler(async(req,res)=>{
//     const id =parseInt(req.params.id);
//     if(!id)
//          return res.status(400).json({error:'not found'});
//     const result= await Deletecategory(id);
//     if(result.rowsAffected[0]===0)
//         return res.status(404).json({error:'No row Affrcted'});
//     res.status(200).json({message:`Deleted ${id} successfully`});
// });

exports.deletecategory=hanlerFact.deleteOne(Deletecategory);
