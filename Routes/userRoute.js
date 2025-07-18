const express = require('express');
const { validatorMiddleware, RoleMiddleware } = require('../middlewares/validatorMiddleware');

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,changePass,getlogUserData
} = require('../services/userService');
const Authion=require('../services/authService');

const { getUserValidator, createUserValidator, updateUserValidator ,changepassValidator} = require('../utils/validators/userValidator');

const router = express.Router();
router.route('/')
.post(
  Authion.protect,
  Authion.allowedTo('admin'),createUserValidator,RoleMiddleware ,createUser)
  .get(Authion.protect,
    Authion.allowedTo('admin'),getAllUsers);
    
    router.get('/getme',Authion.protect,getlogUserData,getUserById);
  router.route('/ch/:id').put(Authion.protect,changepassValidator,changePass);
router.route('/:id')
  .get(getUserValidator, getUserById)
  .put(Authion.protect,
    Authion.allowedTo('admin'),updateUserValidator, updateUser)
  .delete(Authion.protect,
    Authion.allowedTo('admin'),deleteUser);
module.exports = router;
