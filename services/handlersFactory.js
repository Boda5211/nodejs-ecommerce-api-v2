const asyncHandler=require('express-async-handler');
const ApiError=require('../utils/apiError');
const ApiFeatures=require('../utils/apiFeatures');

exports.deleteOne=(deleteFn)=>asyncHandler(async(req,res)=>{
    const id =parseInt(req.params.id);
    if(isNaN(id))
         return res.status(400).json({error:'Invalid ID'});
    const result= await deleteFn(id);
    if(result.rowsAffected[0]===0 || !result.rowsAffected)
        return res.status(404).json({error:`No record found with ID ${id}`});
    res.status(200).json({message:`Record with id ${id} Deleted successfully`});
});
exports.updateOne=(updateFn)=>asyncHandler(async(req,res,next)=>{
    const id=parseInt(req.params.id);
        if(!id||isNaN(id))
            return res.status(400).json({error:'Invalid ID'});
        const data=req.body;
        if(!data || Object.keys(data).length ===0){
            return res.status(400).json({message:'No data provided for update'});
        }
        const result=await updateFn(id,data);
        if(result.rowsAffected[0]===0 || !result.rowsAffected)
            return res.status(404).json({error:`No record found with ID ${id}`});
       res.status(200).json({message:`Record with id ${id} Updated successfully`}); 
    });
exports.cerateOne=(insertFn)=>asyncHandler(async(req,res,next)=>{

const data={...req.body,...req.params};

if(!data || Object.keys(data).length ===0){
     return res.status(400).json({message:'No data provided for update'});
}
const result=await insertFn(data);

    if(!result ||!result.rowsAffected ||result.rowsAffected[0]===0 )
            return res.status(404).json({error:`No record Affected`});
    res.status(201).json({message:`Record Created successfully`}); 
});

exports.GetOneById=(GetOneByIdFn)=>asyncHandler(async(req,res,next)=>{
    const id=req.params.id;
    if(isNaN(id)||!id){
       return next(new ApiError(`id ${id} not found`,400));
    }
    const result=await GetOneByIdFn(id);
     if(!result.recordset ||result.recordset.length === 0 )
         return res.status(404).json({error:'المنتج غير موجود'});
    res.status(200).json(result.recordset[0]);
});
exports.getAll=(GetAllFn)=>asyncHandler(async(req,res)=>{
    const page=req.query.page *1 ||1;
    const limit=req.query.limit *1 || 5;
    //const skip=(page-1)*limit;
    const result =await GetAllFn(page,limit,req.query);
    res.status(200).json({page,limit,count:result.recordset.length,data:result.recordset});
});
