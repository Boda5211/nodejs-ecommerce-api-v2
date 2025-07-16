const ApiError = require("../utils/apiError");
const handleJWTIinvlalidSigenature=()=>
  new ApiError(`invalid token ,please login again...`,401);
const handelTokenExpiredError=()=>
  new ApiError(`your token has expird!  please login again..`,401);
const globalErrorForDev=(err,res)=>{
  res.status(err.statusCode).
  json({status:err.status,err:err,
    message :err.message,
    stack:err.stack
  });
}
const globalErrorForProd=(err,res)=>{
  if(err.name==='JsonWebTokenError') err=handleJWTIinvlalidSigenature();
  if(err.name==='TokenExpiredError') err=handelTokenExpiredError();
  res.status(err.statusCode)
  .json({status:err.status,message:err.message});
};


const globalError=(err,req,res,next)=>{
  err.statusCode=err.statusCode ||500;
  err.status=err.status|| 'error';
   
  if(process.env.NODE_ENV==='development'){
    
    globalErrorForDev(err,res);
  }
  else if(process.env.NODE_ENV==='categoryion'){
    globalErrorForProd(err,res);
  }
};

  module.exports=globalError;
