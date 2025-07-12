const slugify=require('slugify');
const {sql,config}=require('../config/database');

exports.insertSubcategory=async({name,categoryid})=>{
const pool=await sql.connect(config);
const slug=slugify(name,{lower:true,strict:true});
return await pool.request()
    .input('categoryID',sql.Int,categoryid)
    .input('name',sql.NVarChar,name)
    .input('slug',sql.NVarChar,slug)
    .query(`insert into subcategory (name,slug,category_ID)
        values(@name,@slug,@categoryID)`)
}

exports.getSubcategoryBYIDM=async(id)=>{
    const pool=await sql.connect(config);
    return await pool.request()
    .input('id',sql.Int,id)
    .query(`SELECT s.[id]
      ,s.[Name]
      ,s.[slug]
      ,p.name as category_Name			
            ,[updated_Date]
  FROM [Ecommerce].[dbo].[subcategory]s
  join category p on p.id=category_ID where s.id=@id`);
}
exports.getSubcatBYIDand_catidM=async(subid,catid)=>{
    const pool=await sql.connect(config);
    return await pool.request()
    .input('catid',sql.Int,catid)
    .input('subid',sql.Int,subid)
    .query(`SELECT s.[id]
        FROM [Ecommerce].[dbo].[subcategory]s
   where s.id=@subid and s.category_ID=@catid`);
}
exports.getSubCatByName=async(name)=>{
    const pool=await sql.connect(config);
    return await pool.request().
    input('name',sql.NVarChar,name)
    .query('select name from [dbo].[subcategory]s where name=@name ')
}
//offset @skip rows fetch next @limit rows only
exports.getALLSubcategoryM= async (page,limit)=>{
    const pool=await sql.connect(config);
    const skip=(page-1) * limit;
    return await pool.request()
    .input('skip',sql.Int,skip)
    .input('limit',sql.Int,limit)
    .query(`SELECT s.[id]
      ,s.[Name]
      ,s.[slug]
      ,p.name as category_Name			
            ,[updated_Date]
  FROM [Ecommerce].[dbo].[subcategory]s
  join category p on p.id=category_ID  order by s.id
        offset @skip rows fetch next @limit rows only `);
}
exports.getALLSubprBYcategoryIDM= async (page,limit,categoryid)=>{
    const pool=await sql.connect(config);
    const skip=(page-1) * limit;
    return await pool.request()
    .input('skip',sql.Int,skip)
    .input('limit',sql.Int,limit)
    .input('categoryid',sql.Int,categoryid)
    .query(`SELECT s.[id]
      ,s.[Name]
      ,s.[slug]
      ,p.name as category_Name			
            ,[updated_Date]
  FROM [Ecommerce].[dbo].[subcategory]s
  join category p on p.id=category_ID 
  where  category_ID=@categoryid  order by s.id
        offset @skip rows fetch next @limit rows only `);
}
exports.updateSubcategoryM=async(id,{name,categoryid})=>{
    const pool =await sql.connect(config);
    const slug=slugify(name,{lower:true,strict:true})
     return pool.request()
    .input('id',sql.Int,id)
    .input('name',sql.NVarChar,name)
    .input('slug',sql.NVarChar,slug)
    .input('categoryid',sql.Int,categoryid)
    .query(`update subcategory 
        set name=@name,slug=@slug,category_ID=@categoryid , updated_Date=Getdate() where id=@id`)
}

exports.deleteSubprodutM=async(id)=>{
    const pool=await sql.connect(config);
    return pool.request()
    .input('id',sql.Int,id)
    .query('delete from subcategory where id=@id');
}