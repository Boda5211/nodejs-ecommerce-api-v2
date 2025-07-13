const {sql,config}=require('../config/database');
const slugify=require('slugify');

//insert brands

exports.insertbrands=async({name,image})=>{
    const pool =await sql.connect(config);
    const slug=slugify(name,{lower:true,strict:true});
    const result=await pool.request().query('select isnull(max(id)+1,1) as maxID from brands ');
    const maxid=result.recordset[0].maxID;
    const result1= await pool.request().
    input('id',sql.Int,maxid)
    .input('name',sql.NVarChar,name)
    .input('image',sql.NVarChar,image)
    .input('slug',sql.NVarChar,slug)
    .query(`insert into brands (id,name,slug,image)
        OUTPUT INSERTED.* 
        values (@id,@name,@slug,@image)`);
        return result1;
};
//get all brands 
exports.getAllbrands=async function(page,limit){
    const pool =await sql.connect(config);
    const skip=(page -1)*limit;
    const result= await pool.request()
    .input('skip',sql.Int,skip)
    .input('limit',sql.Int,limit).
    query(`select * from brands order by id 
          offset @skip rows fetch next @limit rows only`);
    const BASE_URL=process.env.BASE_URL ||"http://localhost:9000";
    const brands=result.recordset.map(brd =>{
        if(brd.image){
            brd.image=`${BASE_URL}/brands/${brd.image}`;
        }
        return brd;
    });
    return {recordset:brands};
};

// @route git /id
// @access public
//get brands by id
exports.getbrandsByID=async(id)=>{
    const pool =await sql.connect(config);
    const result= await pool.request().
    input('id',sql.Int,id).
    query('select * from brands where id=@id');
    // if(result.recordset.length===0){
        
    // }
    const BASE_URL=process.env.BASE_URL;
    const brand=result.recordset[0];
    if(brand.image){
        brand.image=`${BASE_URL}/brands/${brand.image}`;
    }
    return result;
};
//search about brands
exports.searchAbrands = async (keyword) => {
    const pool = await sql.connect(config);
    return await pool.request()
        .input('keyword', sql.NVarChar, `%${keyword}%`)
        .query('SELECT * FROM brands WHERE name LIKE @keyword');
};
//update brands 
exports.Updatebrands=async(id,{name,image})=>{
    const pool =await sql.connect(config);
    const slug=slugify(name,{lower:true,strict:true});
    const updateResult= await pool.request()
    .input('id',sql.Int,id)
    .input('name',sql.NVarChar,name)
    .input('image',sql.NVarChar,image)
    .input('slug',sql.NVarChar,slug)
    .query('update brands set name=@name , slug=@slug ,image=@image where id=@id');
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

exports.getlastADdbrands=async()=>{
    const pool =await sql.connect(config);
    const result= await pool.request().
   // input('id',sql.Int,id).
    query('select 1 from brands order by id desc');
    // if(result.recordset.length===0){
        
    // }
    const BASE_URL=process.env.BASE_URL;
    const brand=result.recordset[0];
    if(brand.image){
        brand.image=`${BASE_URL}/brands/${brand.image}`;
    }
    return result;
};










