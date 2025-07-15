const { validationResult } = require('express-validator');

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    return res.status(422).json({
      status: 'fail',
      errors: extractedErrors
    });
  }

  next();
};

const RoleMiddleware=(req,res,next)=>{
    const validRoles=['admin','user'];
    if(req.body.role && !validRoles.includes(req.body.role)){
        req.body.role='user';
    }
    next();
};
module.exports = {validatorMiddleware,RoleMiddleware};

