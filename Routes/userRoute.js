const express = require('express');
const { validatorMiddleware, RoleMiddleware } = require('../middlewares/validatorMiddleware');

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,changePass
} = require('../services/userService');

const { getUserValidator, createUserValidator, updateUserValidator } = require('../utils/validators/userValidator');

const router = express.Router();
router.route('/')
  .post(createUserValidator,RoleMiddleware ,createUser)
  .get(getAllUsers);

  router.route('/ch/:id').put(changePass);
router.route('/:id')
  .get(getUserValidator, getUserById)
  .put(updateUserValidator, updateUser)
  .delete(deleteUser);
module.exports = router;
