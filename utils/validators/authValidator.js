const { check,body } = require('express-validator');
const bcrypt=require('bcryptjs');
const {validatorMiddleware} = require('../../middlewares/validatorMiddleware');
const{CheckUnickEmail,CheckUnickEmailonupdate,CheckcurrentPass}=require('../../models/userModel');

// التحقق من بيانات إضافة مستخدم جديد
exports.createAuthValidator = [
  check('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Too short user name'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .custom(async(value)=>{
        //const ema=req.body.email;//,{req}.length>0
        const result=await CheckUnickEmail(value);
        if(result){
            throw new Error(`${value} is already in ues`);
        }
        return true;
    })
    ,
       check('passwordConfirm').notEmpty().withMessage('passwordConfirm is required')
,
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters').
    custom((pass,{req})=>{
        if(pass !==req.body.passwordConfirm){
            throw new Error(`password confirmation incorrect`);
        }
        return true;
    })
        
    ,
  check('phone')
    .optional()
    .isMobilePhone(["ar-EG","ar-SA"]).withMessage('Invalid phone number'),

  validatorMiddleware
];

exports.loginValidator=[
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
    // .custom(async(value)=>{
    //     //const ema=req.body.email;//,{req}.length>0
    //     const result=await CheckUnickEmail(value);
    //     if(result){
    //         throw new Error(`${value} is already in ues`);
    //     }
    //     return true;
    // }),
   check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    // .custom((pass,{req})=>{
        
    //     return true;
    // })
  ,
  validatorMiddleware
]
exports.checknewpassword=[
  body('newPassword').notEmpty().withMessage('New Password is required')
  .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ,
  validatorMiddleware
]