const slugify=require('slugify');
const {sql,config}=require('../config/database');

exports.insertSubProduct=async(name,productId)=>{
const pool=await sql.connect(config);
const slug=slugify(name,{lower:true,strict:true});
return await pool.request()
    .input('productID',sql.Int,productId)
    .input('name',sql.NVarChar,name)
    .input('slug',sql.NVarChar,slug)
    .query(`insert into subProduct (name,slug,product_ID)
        values(@name,@slug,@productID)`)
}