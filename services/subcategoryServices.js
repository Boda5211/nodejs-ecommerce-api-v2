const asyncHandler=require('express-async-handler');
const{insertSubcategory,getSubcategoryBYIDM,getALLSubcategoryM,getALLSubprBYcategoryIDM,
    updateSubcategoryM,deleteSubprodutM}=require('../models/subcategoryModel');
const Apierror=require('../utils/apiError');
const { updatecategory } = require('./categoryServices');
const hanlerFact=require('./handlersFactory');
// exports.createSubcategory=asyncHandler(async(req,res,next)=>{
//     const {name,categoryid}=req.body;
//     if(!name || !categoryid){
//         return next(new Apierror(`must declare categoryid or name`,403));
//     }
//     const result=await insertSubcategory(name,categoryid);
//     res.status(200).json({message:'done'});
// })
exports.createSubcategory=hanlerFact.cerateOne(insertSubcategory);
/*exports.createSubcategory=asyncHandler(async(req,res,next)=>{
    const categoryid=req.params.categoryid;
    const {name}=req.body;
    if(!name || !categoryid){
        return next(new Apierror(`must declare categoryid or name`,403));
    }
    const result=await insertSubcategory(name,categoryid);
    res.status(200).json({message:'done'});
})*/
exports.getsubprodutBYID=hanlerFact.GetOneById(getSubcategoryBYIDM);
/*asyncHandler(async(req,res,next)=>{
    const id=req.params.id;
    if(!id){
        return next(new Apierror(`id requird`,401));
    }
    const getbyid=await getSubcategoryBYIDM(id);
    if(getbyid.recordset.length===0){
        return res.status(405).json({message:`not defind`});
    }
    res.status(201).json({subcategory:getbyid.recordset});
})*/
exports.getALLSubcategory=hanlerFact.getAll(getALLSubcategoryM);
/*asyncHandler(async(req,res)=>{
    const page=req.query.page *1 ||1;
    const limit=req.query.limit*1||4;
    const result=await getALLSubcategoryM(page,limit);
    res.status(200).json({count:result.recordset.length,data:result.recordset});
})*/
exports.getALLSubprBYcategoryTID=asyncHandler(async(req,res)=>{
    const categoryid=req.params.categoryid;
    const page=req.query.page *1 ||1;
    const limit=req.query.limit*1||4;
    const result=await getALLSubprBYcategoryIDM(page,limit,categoryid);
    res.status(200).json({count:result.recordset.length,data:result.recordset});
})
exports.updateSubprodut=hanlerFact.updateOne(updateSubcategoryM);
/*exports.updateSubprodut=asyncHandler(async(req,res)=>{
    const id=req.params.id;
    const {name,categoryid}=req.body;
    const updatesubprodut=await updateSubcategoryM(id,name,categoryid);
    if(updatesubprodut.rowsAffected[0]===0){
        return res.status(404).json({message:`No row Affected`});
    }
    res.status(202).json({message:`updated successfully`});
})*/
exports.DeleteSubcategory=hanlerFact.deleteOne(deleteSubprodutM);
// asyncHandler(async(req,res)=>{
//     const {id} =req.params;
//     const result=await deleteSubprodutM(id);
//     if(result.rowsAffected[0]===0){
//         return res.status(403).json({message:`No row Affected`});
//     }
//     res.status(200).json({message:`delete successfully`});
// })