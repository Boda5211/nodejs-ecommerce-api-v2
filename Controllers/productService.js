
const asyncHandler=require(`express-async-handler`);

const { sql, config } = require('../config/database');
exports.saveproduct = async (req, res) => {
    const { name } = req.body;

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('name', sql.NVarChar, name)
            .query('INSERT INTO Product (name) VALUES (@name)');

        res.status(201).json({ message: '✅ Product inserted successfully' });

    } catch (err) {
        console.error('❌ Error inserting product:', err); // ✅ اطبع الخطأ كامل
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};

// @desc get all product
// @route  get /api/v1/product
// @access public
exports.getProducts=asyncHandler(async (req,res)=>{
    const pool =await sql.connect(config);
    const result=await pool.request().query(`SELECT * FROM Product`);
    res.status(200).json({
        results:result.recordset.length,data:result.recordset
}); });

// @desc get product by id
// @route  get /api/v1/product/id
// @access public
exports.getProductByID=asyncHandler(async (req,res)=>{
    const {id}=req.params;
    const pool=await sql.connect(config);
    const result =await pool.request().input('id',sql.Int,id)
    .query(`select * from product where id=@id`);
    const product=result.recordset[0];
    if(!product)return res.status(404).json({msg:`no product for this id ${id}`});
    res.status(200).json({data:product})
});

// @desc create product 
// @route  get /api/v1/product
// @access public
exports.createProduct=asyncHandler(async (req,res)=>{
        const {name}=req.body;
        if(!name){
            return res.status(400).json({msg:"product name is required"});
        }
        const pool=await sql.connect(config);
        await pool.request()
        .input('name',sql.NVarChar,name)
        .query('insert into product(name) values(@name)');
        res.status(201).json({msg:'praduct created'});
});

// @desc update product 
// @route  get /api/v1/product
// @access public
exports.UpdateProduct=asyncHandler(async (req,res)=>{
        const {id}=req.params;
        const {name}=req.body;
        const pool =await sql.connect(config);
       const result= await pool.request()
        .input('id',sql.Int,id)
        .input('name',sql.NVarChar,name)
        .query(`update product set name=@name where id=@id
          select * from product where id=@id `);
          const product=result.recordset[0];
          res.status(200).json({data:product})
})