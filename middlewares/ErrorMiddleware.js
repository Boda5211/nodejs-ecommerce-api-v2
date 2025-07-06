const globalError=(err,req,res,next)=>{
  err.statusCode=err.statusCode ||500;
  err.status=err.status|| 'error';
   
  if(process.env.NODE_ENV==='development'){
    globalErrorForDev(err,res);
  }
  else if(process.env.NODE_ENV==='production'){
    globalErrorForProd(err,res);
  }
};
const globalErrorForDev=(err,res)=>{
    res.status(err.statusCode).
    json({status:err.status,err:err,
        message :err.message,
        stack:err.stack
    });
}
const globalErrorForProd=(err,res)=>{
  res.status(err.statusCode)
  .json({status:err.status,message:err.message});
};
module.exports=globalError;
