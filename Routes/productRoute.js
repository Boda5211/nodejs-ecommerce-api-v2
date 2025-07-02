const express=require('express');
const{saveproduct,GetAllProduct,GetProductBYID,
    searchAboutProduct,updateproduct
 ,deleteproduct}=require('../services/productServices');

const router =express.Router();

// router.post('/',saveproduct);
// router.get('/',GetAllProduct);
//anther way
router.route('/').post(saveproduct).get(GetAllProduct);
router.put('/:id',updateproduct);
router.get('/search',searchAboutProduct);
router.get('/:id',GetProductBYID);
router.delete('/:id',deleteproduct);
module.exports=router;

     