const { check,body } = require('express-validator');
const bcrypt=require('bcryptjs');
const {validatorMiddleware} = require('../../middlewares/validatorMiddleware');
const{CheckUnickEmail,CheckUnickEmailonupdate,CheckcurrentPass,getUserById}=require('../../models/userModel');
// التحقق من ID المستخدم
exports.getUserValidator = [
  check('id').isInt().withMessage('User ID must be an integer'),
  validatorMiddleware
];
exports.changepassValidator = [
  check('id').isInt().withMessage('User ID must be an integer'),
  body('currentpassword').notEmpty().withMessage('current password is required').
  custom(async(value,{req})=>{
    const id=req.params.id;
    const user=await CheckcurrentPass(id);
    if(!user)throw new Error('User not found');
    const isMatch=await bcrypt.compare(value,user.password);
    //const result=await CheckcurrentPass(value,id);
    if(!isMatch){
      throw new Error(`current password is incorrect`)
    }
    return true;
  })
  ,
   check('passwordConfirm').notEmpty().withMessage('passwordConfirm is required')
,
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage(' new Password must be at least 6 characters').
    custom((pass,{req})=>{
        if(pass !==req.body.passwordConfirm){
            throw new Error(`password confirmation incorrect`);
        }
        return true;
    }),
  validatorMiddleware
];

// التحقق من بيانات إضافة مستخدم جديد
exports.createUserValidator = [
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

// التحقق من بيانات التعديل
exports.updateUserValidator = [
  check('name')
    .optional()
    .isLength({ min: 3 }).withMessage('Too short user name'),
  /*    body('email').optional()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format').custom(async(value,{req})=>{
        const id=req.params.id;//,{req}.length>0
        const result=await CheckUnickEmailonupdate(value,id);
        if(result){
            throw new Error(`${value} is already in ues`);
        }
        return true;
    }),
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
    }),*/
  check('phone')
    .optional()
    .isMobilePhone('ar-EG').withMessage('Invalid phone number'),

  validatorMiddleware
];
