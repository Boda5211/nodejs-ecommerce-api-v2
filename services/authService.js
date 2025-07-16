const asyncHandler=require('express-async-handler');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const ApiError=require('../utils/apiError');
const{insertUserTosinup,finduserByEmail}=require('../models/authModel');
const{getUserById}=require('../models/userModel');
const crypto=require('crypto');
exports.sinUP=asyncHandler(async(req,res)=>{
    const data={...req.body};
    if(!data || Object.keys(data).length ===0){
        return res.status(400).json({message:'No data provided for update'});
    }
    const result=await insertUserTosinup(data);
//||
    if(!result || !result.rowsAffected ||result.rowsAffected[0]===0)
            return res.status(404).json({error:`No record Affected`});

    const lastone=result.recordset?.[0]||null;
    const userid=lastone?.id;
    const token =Rtoken(userid);

    // const token=jwt.sign({userid},process.env.JWT_SECRET_KEY,
    //     {expiresIn:process.env.JWT_EXPIRE_TIME || '3d'}
    // );
    const response={message:`Record Created successfully`,};
    if(lastone){
        response.record=lastone;
        response.token=token;
    }
    res.status(201).json({response}); 
})

exports.login=asyncHandler(async(req,res,next)=>{
const email=req.body.email;
const pass=req.body.password;
const user=await finduserByEmail(email);
//const currpass=await CheckcurrentPassByEmail(email);
if(!user){
    return next(new ApiError(`email or password is in correct`,401));
}

const isMatch=await bcrypt.compare(pass,user.password);
if(!isMatch){
return next(new ApiError(`email or password is in correct`,401));
}
const token =Rtoken(user.id);
res.status(200).json({status:'success',message:'login successful',token});

});

const Rtoken=(payload)=>{
 return jwt.sign({userid:payload},process.env.JWT_SECRET_KEY,
    {expiresIn:process.env.JWT_EXPIRE_TIME});
}

exports.protect=asyncHandler(async(req,res,next)=>{
    //1)check if token exist ,if exist get
    let token;
    if(req.headers.authorization &&
         req.headers.authorization.startsWith('Bearer'))
    {
        token=req.headers.authorization.split(' ')[1];
      }      
    if(!token)
        {
        return next(new ApiError(`you are not login , please login to get access this toute`,401));
        }
//2)Verify token (no change happens, expired token)
 const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
 console.log(decoded);
 //check if user exisits
 const currentUser=await getUserById(decoded.userid);
 if(!currentUser){
    return next(new ApiError(`The user that belong to this token does no longer exist`,401));
 }
 //console.log(userid);
//4)check if user change his password after token created
const ChangePassAt=currentUser.passwordChangedAt;
if(ChangePassAt){
    const date=parseInt(ChangePassAt.getTime()/1000);
    /*
     console.log(currentUser);
    console.log(date);
    console.log(ChangePassAt);
    console.log(date>decoded.iat);
    console.log((date-decoded.iat)/60);*/
if(date>decoded.iat){
        return next(new ApiError(` user recently chenged his password. please login again..`,401));
}
}
req.user=currentUser;
//console.log(req.user);
next();
});

exports.allowedTo=(...roles)=>
    asyncHandler(async(req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new ApiError(`you are not allowed to access this route`,403));
    }
    next();
});

exports.forgetPassword=asyncHandler(async(req,res,next)=>{
    //1) Get user by email
    const user=await finduserByEmail(req.body.email);
    if(!user){
            return next(new ApiError(`There is no user with that email ${req.body.email}`,404));

    }
    //2)if user exist,Generate reset random 6 digits and save in in db
    const resetCode=Math.floor(100000+Math.random()*900000).toString();
    const HashedResecode=crypto.createHash('sha256').
    update(resetCode).digest('hex');
    const expires=new Date(Date.now()+10*60*1000);
   // await 
    //3) send the reset code via email
})