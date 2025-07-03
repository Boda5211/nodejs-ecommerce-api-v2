const {sql,config}=require('../config/database');
const slugify=require('slugify');

//insert product

exports.insertProduct=async(name)=>{
    const pool =await sql.connect(config);
    const slug=slugify(name,{lower:true,strict:true});
    return await pool.request().
    input('name',sql.NVarChar,name)
    .input('slug',sql.NVarChar,slug)
    .query('insert into product (name,slug) values (@name,@slug)');
};
//get all product 
exports.getAllProduct=async function(page,limit){
    const pool =await sql.connect(config);
    const skip=(page -1)*limit;
    return await pool.request()
    .input('skip',sql.Int,skip)
    .input('limit',sql.Int,limit).
    query(`select * from product order by id 
          offset @skip rows fetch next @limit rows only`);
};

// @route git /id
// @access public
//get product by id
exports.getProductByID=async(id)=>{
    const pool =await sql.connect(config);
    return await pool.request().
    input('id',sql.Int,id).
    query('select * from product where id=@id');
};
//search about product
exports.searchAproduct = async (keyword) => {
    const pool = await sql.connect(config);
    return await pool.request()
        .input('keyword', sql.NVarChar, `%${keyword}%`)
        .query('SELECT * FROM product WHERE name LIKE @keyword');
};
//update product 
exports.UpdateProduct=async(id,name)=>{
    const pool =await sql.connect(config);
    return await pool.request()
    .input('id',sql.Int,id)
    .input('name',sql.NVarChar,name)
    .query('update product set name=@name where id=@id');
}
//delete product
exports.DeleteProduct=async(id)=>{
    const pool= await sql.connect(config);
    return await pool.request().
    input('id',sql.Int,id)
    .query('delete from product where id=@id');
}












