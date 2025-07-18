const asyncHandler=require(`express-async-handler`);
const hanlerFact=require('./handlersFactory');
const ApiError=require('../utils/apiError');
const {insertUser,getAllUsers,getUserById,updateUser,
    deleteUser,searchUsersByName,changepass}=require('../models/userModel');

exports.createUser=hanlerFact.cerateOne(insertUser);
exports.getAllUsers = hanlerFact.getAll(getAllUsers);
exports.getUserById = hanlerFact.GetOneById(getUserById);
exports.updateUser = hanlerFact.updateOne(updateUser);
exports.deleteUser = hanlerFact.deleteOne(deleteUser);
exports.changePass = hanlerFact.updateOne(changepass);
exports.searchUsers = async (req, res, next) => {
  const keyword = req.query.keyword;
  if (!keyword) {
    return next(new ApiError('يرجى توفير كلمة البحث في query parameter باسم keyword', 400));
  }

  const result = await searchUsersByName(keyword);
  res.status(200).json({
    results: result.recordset.length,
    data: result.recordset,
  });
};

exports.getlogUserData=asyncHandler(async(req,res,next)=>{
  console.log(req.params.id,'1');
  console.log(req.user.id,'2');
  req.params.id=req.user.id;
  console.log(req.params.id);
  console.log(req.user.id);
  next();
})