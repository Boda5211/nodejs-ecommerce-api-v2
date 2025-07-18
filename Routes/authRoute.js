const express = require('express');
//const { validatorMiddleware, RoleMiddleware } = require('../middlewares/validatorMiddleware');

const {
  sinUP,login,forgetPassword,VerifyResetC,resetPassword
} = require('../services/authService');

const { createAuthValidator ,loginValidator,checknewpassword} = require('../utils/validators/authValidator');

const router = express.Router();
router.route('/sinup')
  .post(createAuthValidator ,sinUP)
router.route('/reset')
  .post(forgetPassword)
router.route('/verify')
  .post(VerifyResetC)
router.route('/login')
  .post(loginValidator ,login)
router.route('/resPass')
  .put(checknewpassword,resetPassword)
 
module.exports = router;
