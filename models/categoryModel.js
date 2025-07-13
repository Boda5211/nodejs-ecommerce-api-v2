const {sql,config}=require('../config/database');
const slugify=require('slugify');

//insert category

exports.insertcategory=async({name,image})=>{
    const pool =await sql.connect(config);
    const slug=slugify(name,{lower:true,strict:true});
    return await pool.request().
    input('name',sql.NVarChar,name)
    .input('slug',sql.NVarChar,slug)
    .input('image',sql.NVarChar,image)
    .query('insert into category (name,slug,image) values (@name,@slug,@image)');
};

//get all category 
exports.getAllcategory=async function(page,limit){
    const pool =await sql.connect(config);
    const skip=(page -1)*limit;
    const result= await pool.request()
    .input('skip',sql.Int,skip)
    .input('limit',sql.Int,limit).
    query(`select * from category order by id 
          offset @skip rows fetch next @limit rows only`);
    const categorys=result.recordset.map(cat=>{
        if(cat.image){
            cat.image=`${process.env.BASE_URL}/category/${cat.image}`;
        }
        return cat;
    });
return {recordset:categorys};
        };

// @route git /id
// @access public
//get category by id
exports.getcategoryByID=async(id)=>{
    const pool =await sql.connect(config);
    const result= await pool.request().
    input('id',sql.Int,id).
    query('select * from category where id=@id');
    const category=result.recordset[0];
    if(category.image){
        category.image=`${process.env.BASE_URL}/category/${category.image}`;
    }
    return result;
};
//search about category
exports.searchAcategory = async (keyword) => {
    const pool = await sql.connect(config);
    return await pool.request()
        .input('keyword', sql.NVarChar, `%${keyword}%`)
        .query('SELECT * FROM category WHERE name LIKE @keyword');
};
//update category 
exports.Updatecategory=async(id,{name,image})=>{
    const pool =await sql.connect(config);
    const request=pool.request().input('id',sql.Int,id);
    if(name){
        request.input('name',sql.NVarChar,name );
        let slug=slugify(name,{lower:true,strict:true});
        request.input('slug',sql.NVarChar,slug);
    }
    if(image){
        request.input('image',sql.NVarChar,image );
    }
    const updateResult= await request
       .query(`update category set
        ${ name ? 'name=isnull(@name,name),slug=isnull(@slug,slug)':'' }
        ${name && image?',':''}
        ${image?' image=isnull(@image,image)':''}
        where id=@id`);
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












