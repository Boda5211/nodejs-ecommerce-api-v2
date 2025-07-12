const {sql,config}=require('../config/database');
const slugify=require('slugify');

//insert category

exports.insertcategory=async({name})=>{
    const pool =await sql.connect(config);
    const slug=slugify(name,{lower:true,strict:true});
    return await pool.request().
    input('name',sql.NVarChar,name)
    .input('slug',sql.NVarChar,slug)
    .query('insert into category (name,slug) values (@name,@slug)');
};

//get all category 
exports.getAllcategory=async function(page,limit){
    const pool =await sql.connect(config);
    const skip=(page -1)*limit;
    return await pool.request()
    .input('skip',sql.Int,skip)
    .input('limit',sql.Int,limit).
    query(`select * from category order by id 
          offset @skip rows fetch next @limit rows only`);
};

// @route git /id
// @access public
//get category by id
exports.getcategoryByID=async(id)=>{
    const pool =await sql.connect(config);
    return await pool.request().
    input('id',sql.Int,id).
    query('select * from category where id=@id');
};
//search about category
exports.searchAcategory = async (keyword) => {
    const pool = await sql.connect(config);
    return await pool.request()
        .input('keyword', sql.NVarChar, `%${keyword}%`)
        .query('SELECT * FROM category WHERE name LIKE @keyword');
};
//update category 
exports.Updatecategory=async(id,{name})=>{
    const pool =await sql.connect(config);
    const slug=slugify(name,{lower:true,strict:true});
    const updateResult= await pool.request()
    .input('id',sql.Int,id)
    .input('name',sql.NVarChar,name)
    .input('slug',sql.NVarChar,slug)
    .query('update category set name=@name , slug=@slug where id=@id');
    return updateResult;
   /*  if (updateResult.rowsAffected[0] === 0) {
        return null; // مفيش صف اتأثر => مفيش منتج بالـ id ده
    }
    const result=await pool.request().
    input('id',sql.Int,id)
    .query('select * from category where id =@id');
    
    return result.recordset[0];*/
}
//delete category
exports.Deletecategory=async(id)=>{
    const pool= await sql.connect(config);
    return await pool.request().
    input('id',sql.Int,id)
    .query('delete from category where id=@id');
}












