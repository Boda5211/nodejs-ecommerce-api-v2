const {param,check,body}=require('express-validator');
const validatorMiddleware=require('../../middlewares/validatorMiddleware')


exports.getProductValidator=[
    param('id').isInt().withMessage('id is not difind'),
validatorMiddleware
]
exports.putProductValidator=[
    check('id').isInt().withMessage('id undefined'),
    body('name').notEmpty()
    .withMessage('name must by not empty')
    .isLength({min:2}).withMessage('Too short product name')
    .isLength({max:20}).withMessage('Too long product name'),validatorMiddleware
]
