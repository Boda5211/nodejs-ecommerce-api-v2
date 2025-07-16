const express=require('express');

const { createSubcategory ,getsubprodutBYID,getALLSubcategory,updateSubprodut,DeleteSubcategory,getALLSubprBYcategoryTID} = require('../services/subcategoryServices'); // لو الملف فيه s في الآخر
const Authion=require('../services/authService');

const {postSubcategoryValidator,getSubcategorybyidValidator,getallSubcategoryValidator,putsubprodutValidator}=require('../utils/validators/subcategoryValidator');
 //express.Router();
const router=express.Router({mergeParams:true});
//postSubcategoryValidator,
router.route('/').post(Authion.protect,
    Authion.allowedTo('admin'),postSubcategoryValidator,createSubcategory);
router.route('/:id').delete(Authion.protect,
    Authion.allowedTo('admin'),getSubcategorybyidValidator,DeleteSubcategory);
router.route('/:id').get(getSubcategorybyidValidator,getsubprodutBYID)
.put(Authion.protect,
    Authion.allowedTo('admin'),putsubprodutValidator,updateSubprodut);
router.route('/p/:categoryid').get(getALLSubprBYcategoryTID);
router.route('//').get(getallSubcategoryValidator,getALLSubcategory);
module.exports=router;