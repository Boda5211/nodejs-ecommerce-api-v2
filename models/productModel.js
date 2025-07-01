const {sql,config}=require('../config/database');


//insert product
exports.insertProduct=async(name)=>{
    const pool =await sql.connect(config);
    return await pool.request().
    input('name',sql.NVarChar,name)
    .query('insert into product (name) values (@name)');
};
//get all product 
exports.getAllProduct=async()=>{
    const pool =await sql.connect(config);
    return await pool.request().query('select * from product order by id');
};
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














exports.DeleteProduct=async(id)=>{
    const pool=sql.connect(config);
    return await pool
}












