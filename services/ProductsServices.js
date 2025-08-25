// services/productService.js
require('colors');
const asyncHandler = require('express-async-handler');
const { insertProduct, getProductById, updateProduct, deleteProduct ,getAllProducts,getAllp} = require('../models/productsModel');

const hanlerFact=require('./handlersFactory');
const ApiFeatures=require('../utils/apiFeatures');

const sharp=require('sharp');
const{v4:uuidv4}=require('uuid');
const {uploadArrayOFImages}=require('../middlewares/uploadImageMiddleware')
// @desc    Create new product
// @route   POST /products
exports.createProduct = hanlerFact.cerateOne(insertProduct);

// @desc    Get product by ID
// @route   GET /products/:id

exports.getProduct = hanlerFact.GetOneById(getProductById);
// @desc    Update product by ID
// @route   PUT /products/:id


exports.updateProduct =hanlerFact.updateOne(updateProduct);
// @desc    Delete product by ID
// @route   DELETE /products/:id

exports.deleteProduct =hanlerFact.deleteOne(deleteProduct);


exports.uploadproductImg=uploadArrayOFImages([
  {
    name:'imageCover',
    maxCount:1
  },
  {
    name:'images',
    maxCount:5,
  },
]);
exports.resizeProductImages=asyncHandler(async(req,res,next)=>{
    if(req.files.imageCover){
      const imageCoverFileName=`product-${uuidv4()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
      .resize(2000,1333)
      .toFormat('jpeg')
      .jpeg({quality:90})
      .toFile(`uploads/products/${imageCoverFileName}`);
        req.body.imageCover=imageCoverFileName;
    }
    if(req.files.images)
    {
      req.body.images=[];
      await Promise.all(  req.files.images.map(async(img,index)=>
      {
        const imageFilename=`product-${uuidv4()}-${Date.now()}-${index +1}.jpeg`;
        await sharp(img.buffer)
        .resize(600,600)
        .toFormat('jpeg')
        .jpeg({quality:91})
        .toFile(`uploads/products/${imageFilename}`);
        req.body.images.push(imageFilename);
      }));
    }
    next();
});
/*exports.createProduct = asyncHandler(async (req, res, next) => {
  const data = req.body;
  const result = await insertProduct(data);
  res.status(201).json({ message: 'Product created successfully', data: result.recordset });
});*/
/* asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await getProductById(id);
  if (result.recordset.length === 0) {
    return next(new ApiError(`Product not found with id ${id}`, 404));
  }
  res.status(200).json(result.recordset[0]);
});
*/
/*exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const result = await updateProduct(id, data);
  if (result.rowsAffected[0] === 0) {
    return next(new ApiError(`No product updated with id ${id}`, 404));
  }
  res.status(200).json({ message: 'Product updated successfully' });
});
*/
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
  const limit = parseInt(req.query.limit) || 10;

  const queryStringobj = { ...req.query };
  const excludesFields = ['page', 'limit', 'sort'];
  excludesFields.forEach((field) => delete queryStringobj[field]);

  // 1️⃣ إعداد WHERE
  const whereConditions = [];
  for (const key in queryStringobj) {
    const value = queryStringobj[key];
    if (typeof value === 'object' && value !== null) {
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
          : Number(value[op]);

        whereConditions.push(`p.${key} ${sqlOp} ${val}`);
      }
    } else {
      const val = isNaN(value) ? `'${value}'` : Number(value);
      whereConditions.push(`p.${key} = ${val}`);
    }
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // 2️⃣ ترتيب النتائج
  const sortQuery = req.query.sort;
  let orderByClause = 'ORDER BY p.id';
  if (sortQuery) {
    const allowedSortFields = ['id', 'price', 'title', 'ratingsAverage', 'quantity'];
    const sortFields = sortQuery.split(',').map(field => {
      const cleanField = field.replace('-', '');
      if (!allowedSortFields.includes(cleanField)) return null;
      return field.startsWith('-') ? `p.${cleanField} DESC` : `p.${cleanField} ASC`;
    }).filter(Boolean);

    if (sortFields.length > 0) {
      orderByClause = `ORDER BY ${sortFields.join(',')}`;
    }
  }

  // 3️⃣ تنفيذ الاستعلام
  const result = await getAllProducts(page, limit, whereClause, orderByClause);

  // 4️⃣ لا نحذف fields هنا
  const data = result.data;

  // 5️⃣ الإرسال
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


