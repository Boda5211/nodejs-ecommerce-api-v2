// models/productsModel.js

const slugify = require('slugify');
const { sql, config } = require('../config/database');

// Create product
exports.insertProduct = async ({
  title, description, quantity, price,
  priceAfterDiscount = null,
  imageCover,
  images = null,
  colors = null,
  category_ID,
  subcategory_ID = null,Arrayof_Subcategory=null,
  brand_ID = null
}) => {
  const pool = await sql.connect(config);
  const slug = slugify(title, { lower: true, strict: true });

  return await pool.request()
    .input('title', sql.NVarChar, title)
    .input('slug', sql.NVarChar, slug)
    .input('description', sql.NVarChar, description)
    .input('quantity', sql.Int, quantity)
    .input('price', sql.Decimal(10, 2), price)
    .input('priceAfterDiscount', sql.Decimal(10, 2), priceAfterDiscount ?? null)
    .input('imageCover', sql.NVarChar, imageCover)
    .input('images', sql.NVarChar, images ? JSON.stringify(images) : null)
    .input('colors', sql.NVarChar, colors ? JSON.stringify(colors) : null)
    .input('Arrayof_Subcategory', sql.NVarChar, Arrayof_Subcategory ? JSON.stringify(Arrayof_Subcategory) : null)
    .input('category_ID', sql.Int, category_ID)
    .input('subcategory_ID', sql.Int, subcategory_ID ?? null)
    .input('brand_ID', sql.Int, brand_ID ?? null)
    .query(`
      INSERT INTO Products
        (title, slug, description, quantity, price, priceAfterDiscount, imageCover, images, colors, category_ID, subcategory_ID, brand_ID,Arrayof_Subcategory)
      VALUES
        (@title, @slug, @description, @quantity, @price, @priceAfterDiscount, @imageCover, @images, @colors, @category_ID, @subcategory_ID, @brand_ID,@Arrayof_Subcategory)
    `);
};


// Get product by ID
exports.getProductById = async (id) => {
  const pool = await sql.connect(config);
  return await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM Products WHERE id = @id');
};

// Update product
exports.updateProduct = async (id, { title, description, quantity, price, priceAfterDiscount,
   imageCover, images, colors, category_ID, subcategory_ID, brand_ID,Arrayof_Subcategory }) => {
  const pool = await sql.connect(config);
  const slug = title ? slugify(title, { lower: true, strict: true }) : null;
  return await pool.request()
    .input('id', sql.Int, id)
    .input('title', sql.NVarChar, title)
    .input('slug', sql.NVarChar, slug)
    .input('description', sql.NVarChar, description)
    .input('quantity', sql.Int, quantity)
    .input('price', sql.Decimal(10, 2), price)
    .input('priceAfterDiscount', sql.Decimal(10, 2), priceAfterDiscount)
    .input('imageCover', sql.NVarChar, imageCover)
    .input('images', sql.NVarChar, images)
    .input('colors', sql.NVarChar, colors)
    .input('category_ID', sql.Int, category_ID)
    .input('subcategory_ID', sql.Int, subcategory_ID)
    .input('Arrayof_Subcategory',sql.NVarChar,Arrayof_Subcategory ?JSON.stringify(Arrayof_Subcategory):null)
    .input('brand_ID', sql.Int, brand_ID)
    .query(`UPDATE Products SET 
              title = ISNULL(@title, title),
              slug = ISNULL(@slug, slug),
              description = ISNULL(@description, description),
              quantity = ISNULL(@quantity, quantity),
              price = ISNULL(@price, price),
              priceAfterDiscount = ISNULL(@priceAfterDiscount, priceAfterDiscount),
              imageCover = ISNULL(@imageCover, imageCover),
              images = ISNULL(@images, images),
              colors = ISNULL(@colors, colors),
              category_ID = ISNULL(@category_ID, category_ID),
              subcategory_ID = ISNULL(@subcategory_ID, subcategory_ID),
              Arrayof_Subcategory=isNull(@Arrayof_Subcategory,Arrayof_Subcategory),
              brand_ID = ISNULL(@brand_ID, brand_ID),
              updated_Date = GETDATE()
           WHERE id = @id`);
};

// Delete product
exports.deleteProduct = async (id) => {
  const pool = await sql.connect(config);
  return await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM Products WHERE id = @id');
};

exports.getAllProducts = async (page,limit,whereStatement,sortStatement) => {
  const skip=((page-1)*limit);
  const pool = await sql.connect(config);
  return await pool.request()
  .input('skip',sql.Int,skip)
  .input('limit',sql.Int,limit)
  .query(`SELECT 
  p.id,
  p.title,
  p.slug,
  p.description,
  p.quantity,
  p.sold,
  p.price,
  p.priceAfterDiscount,
  p.imageCover,
  p.images,
  p.colors,
  p.category_ID,
  c.name AS category_Name,
  p.subcategory_ID,
  s.Name AS subcategory_Name,
  p.Arrayof_Subcategory,

  -- ✅ الحل هنا: تنظيف ثم split ثم join
  STUFF((
      SELECT ',' + sub.Name
      FROM STRING_SPLIT(
  REPLACE(REPLACE(ISNULL(p.Arrayof_Subcategory, ''), '[', ''), ']', ''),
  ','
)
 AS splitted
      JOIN subcategory sub 
        ON TRY_CAST(splitted.value AS INT) = sub.id
      FOR XML PATH(''), TYPE
  ).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS Arrayof_Subcategory_Names,

  p.brand_ID,
  b.Name AS Brand_name,
  p.ratingsAverage,
  p.ratingsQuantity,
  p.updated_Date

FROM Products p
LEFT JOIN Brands b ON b.id = p.brand_ID
LEFT JOIN subcategory s ON p.subcategory_ID = s.id
LEFT JOIN category c ON p.category_ID = c.id
${whereStatement}
 ${sortStatement}
offset @skip rows fetch next @limit rows only;`);
};


exports.getAllp=async(selectFields,page,limit,whereClause,sortClause)=>{
  const skip=(page-1)*limit;
  const pool=await sql.connect(config);
  return pool.request().input('skip',sql.Int,skip)
  .input('limit',sql.Int,limit)
  .query(`select ${selectFields} from 
    Products p
LEFT JOIN Brands b ON b.id = p.brand_ID
LEFT JOIN subcategory s ON p.subcategory_ID = s.id
LEFT JOIN category c ON p.category_ID = c.id
${whereClause}
   ${sortClause ? sortClause : 'ORDER BY p.id'}
offset @skip rows fetch next @limit rows only;`);
};