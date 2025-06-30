const {sql,config}=require('../Config2/database');
exports.insertCategory=async(name)=>{
    const pool =await sql.connect(config);
    return await pool.request().
    input('name',sql.NVarChar,name)
    .query('insert into product (name) values (@name)');
};s