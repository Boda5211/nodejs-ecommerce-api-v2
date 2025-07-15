const {param,check,body}=require('express-validator');
const {validatorMiddleware}=require('../../middlewares/validatorMiddleware')


exports.getcategoryValidator=[
    param('id').isInt().withMessage('id is not difind'),
validatorMiddleware
]
exports.putcategoryValidator=[
    check('id').isInt().withMessage('id undefined'),
    body('name').notEmpty().optional()
    .withMessage('name must by not empty')
    .isLength({min:2}).withMessage('Too short category name')
    .isLength({max:20}).withMessage('Too long category name'),validatorMiddleware
]

