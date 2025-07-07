const  {validationResult} =require('express-validator');

const validatorMiddleware=(req,res,next)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
        res.status(200).json({error:error.array()});
    }
    next();
}
module.exports=validatorMiddleware;