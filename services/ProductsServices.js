// services/productService.js
require('colors');
const asyncHandler = require('express-async-handler');
const { insertProduct, getProductById, updateProduct, deleteProduct ,getAllProducts,getAllp} = require('../models/productsModel');
const ApiError = require('../utils/apiError');
const { query } = require('mssql');
const hanlerFact=require('./handlersFactory');
const ApiFeatures=require('../utils/apiFeatures');
// @desc    Create new product
// @route   POST /products
exports.createProduct = hanlerFact.cerateOne(insertProduct);
/*exports.createProduct = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const result = await insertProduct(data);
  res.status(201).json({ message: 'Product created successfully', data: result.recordset });
});*/

// @desc    Get product by ID
// @route   GET /products/:id

exports.getProduct = hanlerFact.GetOneById(getProductById);
/* asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await getProductById(id);
  if (result.recordset.length === 0) {
    return next(new ApiError(`Product not found with id ${id}`, 404));
  }
  res.status(200).json(result.recordset[0]);
});
*/
// @desc    Update product by ID
// @route   PUT /products/:id
/*
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const result = await updateProduct(id, data);
  if (result.rowsAffected[0] === 0) {
    return next(new ApiError(`No product updated with id ${id}`, 404));
  }
  res.status(200).json({ message: 'Product updated successfully' });
});
*/
exports.updateProduct =hanlerFact.updateOne(updateProduct);
// @desc    Delete product by ID
// @route   DELETE /products/:id

exports.deleteProduct =hanlerFact.deleteOne(deleteProduct);
/* asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await deleteProduct(id);
  if (result.rowsAffected[0] === 0) {
    return next(new ApiError(`No product deleted with id ${id}`, 404));
  }
  res.status(204).json({ message: 'Product deleted successfully' });
});*/
/*
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const page=req.query.page || 1;
  const limit=req.query.limit || 3;
  const queryStringobj={...req.query};
  const excludesFilds=['page','limit'];
  excludesFilds.forEach((field)=>delete queryStringobj[field]);
  console.log(queryStringobj);
  console.log(req.query);
  let whereClause="";
  const whereConditions=[];
  if(queryStringobj.price){
    whereConditions.push(`p.price=${parseFloat(queryStringobj.price)}`);
  }
  if(queryStringobj.ratingsAverage){
    whereConditions.push(`p.ratingsAverage=${parseFloat(queryStringobj.ratingsAverage)}`);
  }
if(whereConditions.length>0){
  whereClause=`where ${whereConditions.join(" AND ")}`;
}
   const result = await getAllProducts(page,limit,whereClause);
  let data=result.recordset;
  data=data.map(prod =>{
    const {colors,images,ratingsQuantity, ...filtered}=prod;
    return filtered;
  });
  res.status(200).json({ count: data.length, data: data });
});*/
// exports.getAllProducts = asyncHandler(async (req, res, next) => {
//   const page=req.query.page || 1;
//   const limit=req.query.limit || 3;
//   const queryStringobj={...req.query};
//   const excludesFilds=['page','limit'];
//   excludesFilds.forEach((field)=>delete queryStringobj[field]);
//   // فلتره ذكيه للعمليات (gt,gte,lt,lte)
//   const whereConditions=[];
//   for(const key in queryStringobj){
//     const value=queryStringobj[key];
//     //فحص لو المفتاح من النوع filed[gte]
//     const match = key.match(/^(\w+)\[(gte|lte|lt|gt|ne|like)\]$/);

//     if(match){
//       const field=match[1];
//       const operator=match[2];
//        const sqlOperators = {
//         gte: '>=', gt: '>', lte: '<=', lt: '<',
//         ne: '<>', like: 'LIKE'
//       };
//       let val=value;
//       if(operator==='like'){
//         val=`'%${value}%'`;
//       }else{
//         val=isNaN(value)?`'${value}'`:parseFloat(value);
//       }
//       whereConditions.push(`p.${field} ${sqlOperators[operator]} ${val}`);

//     }else{
//       //لو القيمه نصيه زى title
//       const val=isNaN(value)?`'${value}'`:parseFloat(value);
//       whereConditions.push(`p.${key}=${val}`);
//     }
//   }
//   //where finally
//   const whereClause=whereConditions.length>0?`where ${whereConditions.join(' and ')}`:"";
//   // 
//   const result =await getAllProducts(page, limit, whereClause);

//   // 6️⃣ تنظيف البيانات (لو حبيت تشيل بعض الحقول)
//   let data = result.recordset.map(prod => {
//     const { colors, images, ratingsQuantity, ...filtered } = prod;
//     return filtered;
//   });

//   // 7️⃣ الإرسال للعميل
//   res.status(200).json({
//     count: data.length,
//     data
//   });


// });
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;

  const queryStringobj = { ...req.query };
  const excludesFields = ['page', 'limit','sort'];
  excludesFields.forEach((field) => delete queryStringobj[field]);

  // 1️⃣ إعداد whereConditions
  const whereConditions = [];

  for (const key in queryStringobj) {
    const value = queryStringobj[key];

    if (typeof value === 'object' && value !== null) {
      // التعامل مع فلاتر مثل price[lte]=1000
      for (const op in value) {
        const sqlOperators = {
          gte: '>=',
          gt: '>',
          lte: '<=',
          lt: '<',
          ne: '<>',
          like: 'LIKE'
        };

        const sqlOp = sqlOperators[op];
        if (!sqlOp) continue;

        const val = isNaN(value[op])
          ? (op === 'like' ? `'%${value[op]}%'` : `'${value[op]}'`)
          : parseFloat(value[op]);

        whereConditions.push(`p.${key} ${sqlOp} ${val}`);
      }
    } else {
      // فلاتر مباشرة مثل category_ID=3
      const val = isNaN(value) ? `'${value}'` : parseFloat(value);
      whereConditions.push(`p.${key} = ${val}`);
    }
  }

  // 2️⃣ بناء جملة WHERE النهائية
  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
//sortStatement
//const sortQuery=queryStringobj.sort;
const sortQuery=req.query.sort;
let orderByClause='order by p.id';
if(sortQuery){
  const sortFields=sortQuery.split(',').map(field=>{
    if(field.startsWith('-')){
      return `p.${field.slice(1)} DESC`;
    }
    return `p.${field} Asc`;
  })

  orderByClause=`order by ${sortFields.join(',')}`;
  console.log(orderByClause);
}

  // 3️⃣ تنفيذ الاستعلام
  const result = await getAllProducts(page, limit, whereClause,orderByClause);

  // 4️⃣ تنظيف الداتا قبل الإرسال
  const data = result.recordset.map((prod) => {
    const { colors, images, ratingsQuantity, ...filtered } = prod;
    return filtered;
  });

  // 5️⃣ الإرسال للعميل
  res.status(200).json({
    count: data.length,
    data
  });
});

/*
exports.GetAllp=asyncHandler(async(req,res,next)=>{
  const features=new ApiFeatures(req.query).
  filter().sort().limitFields().paginate();
  const {
    whereClause,orderByClause,selectedFields,page,limit
  }=features;
  const result=await getAllp(selectedFields,page,limit
    ,whereClause,orderByClause
  );
const data=result.recordset.map((prod)=>{
  const {colors,images,...filtered}=prod;
  return filtered;
});
res.status(200).json({count:data.length,page:features.page,data});
});*/
exports.GetAllp = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const {
    whereClause,
    orderByClause,
    selectedFields,
    page,
    limit
  } = features;

  const result = await getAllp(
    selectedFields,
    page,
    limit,
    whereClause,
    orderByClause
  );

  const data = result.recordset.map((prod) => {
    const { colors, images, ...filtered } = prod;
    return filtered;
  });

  res.status(200).json({
    count: data.length,
    page,
    data
  });
});
