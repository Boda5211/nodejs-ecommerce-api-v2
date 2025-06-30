const asyncHandler=require(`express-async-handler`);
const {sql , config}=require(`../config/database`);

exports.saveproduct=async(req,res)=>{
    const {name}=req.body;
    try{
        const pool =await sql.connect(config);
        await pool.request().
        input('name',sql.NVarChar,name).
        query('insert into Product (Name) values (@name)');
        res.status(201).json({message:'تمت الاضافه بنجاح'});

    }catch(err){
        console.error('❌ خطأ اثناء الاضافه',err);
        res.status(410).json({error:'error in database',details:err.message});
    }
};