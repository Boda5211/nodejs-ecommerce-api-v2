const express=require('express');

const { createSubcategory ,getsubprodutBYID,getALLSubcategory,updateSubprodut,DeleteSubcategory,getALLSubprBYcategoryTID} = require('../services/subcategoryServices'); // لو الملف فيه s في الآخر

const {postSubcategoryValidator,getSubcategorybyidValidator,getallSubcategoryValidator,putsubprodutValidator}=require('../utils/validators/subcategoryValidator');
 //express.Router();
const router=express.Router({mergeParams:true});
//postSubcategoryValidator,
router.route('/').post(postSubcategoryValidator,createSubcategory);
router.route('/:id').delete(getSubcategorybyidValidator,DeleteSubcategory);
router.route('/:id').get(getSubcategorybyidValidator,getsubprodutBYID).put(putsubprodutValidator,updateSubprodut);
router.route('/p/:categoryid').get(getALLSubprBYcategoryTID);
router.route('//').get(getallSubcategoryValidator,getALLSubcategory);
module.exports=router;