const {sql,config}=require('../config/database');
const slugify=require('slugify');

//insert brands

exports.insertbrands=async({name,image})=>{
    const pool =await sql.connect(config);
    const slug=slugify(name,{lower:true,strict:true});
    const result=await pool.request().query('select isnull(max(id)+1,1) as maxID from brands ');
    const maxid=result.recordset[0].maxID;
    return await pool.request().
    input('id',sql.Int,maxid)
    .input('name',sql.NVarChar,name)
    .input('img',sql.NVarChar,image)
    .input('slug',sql.NVarChar,slug)
    .query('insert into brands (id,name,slug,image) values (@id,@name,@slug,@img)');
};
//get all brands 
exports.getAllbrands=async function(page,limit){
    const pool =await sql.connect(config);
    const skip=(page -1)*limit;
    return await pool.request()
    .input('skip',sql.Int,skip)
    .input('limit',sql.Int,limit).
    query(`select * from brands order by id 
          offset @skip rows fetch next @limit rows only`);
};

// @route git /id
// @access public
//get brands by id
exports.getbrandsByID=async(id)=>{
    const pool =await sql.connect(config);
    return await pool.request().
    input('id',sql.Int,id).
    query('select * from brands where id=@id');
};
//search about brands
exports.searchAbrands = async (keyword) => {
    const pool = await sql.connect(config);
    return await pool.request()
        .input('keyword', sql.NVarChar, `%${keyword}%`)
        .query('SELECT * FROM brands WHERE name LIKE @keyword');
};
//update brands 
exports.Updatebrands=async(id,{name})=>{
    const pool =await sql.connect(config);
    const slug=slugify(name,{lower:true,strict:true});
    const updateResult= await pool.request()
    .input('id',sql.Int,id)
    .input('name',sql.NVarChar,name)
    .input('slug',sql.NVarChar,slug)
    .query('update brands set name=@name , slug=@slug where id=@id');
     /*if (updateResult.rowsAffected[0] === 0) {
        return null; // مفيش صف اتأثر => مفيش منتج بالـ id ده
    }
    const result=await pool.request().
    input('id',sql.Int,id)
    .query('select * from brands where id =@id');
    
    return result.recordset[0];*/
    return updateResult;
}
//delete brands
exports.Deletebrands=async(id)=>{
    const pool= await sql.connect(config);
    return await pool.request().
    input('id',sql.Int,id)
    .query('delete from brands where id=@id');
}












