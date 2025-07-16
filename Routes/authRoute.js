const express = require('express');
//const { validatorMiddleware, RoleMiddleware } = require('../middlewares/validatorMiddleware');

const {
  sinUP,login
} = require('../services/authService');

const { createAuthValidator ,loginValidator} = require('../utils/validators/authValidator');

const router = express.Router();
router.route('/sinup')
  .post(createAuthValidator ,sinUP)
router.route('/login')
  .post(loginValidator ,login)
 
module.exports = router;
