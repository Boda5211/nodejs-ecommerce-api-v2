const {sql,config}=require('../config/database');
exports.insertCategory=async(name)=>{
    const pool =await sql.connect(config);
    return await pool.request().
    input('name',sql.NVarChar,name)
    .query('insert into product (name) values (@name)');
};s