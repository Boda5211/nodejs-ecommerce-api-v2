// models/productsModel.js

const slugify = require('slugify');
const { sql, config } = require('../config/database');
const BASE_URL=process.env.BASE_URL;
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
         OUTPUT INSERTED.*
      VALUES
        (@title, @slug, @description, @quantity, @price, @priceAfterDiscount, @imageCover, @images, @colors, @category_ID, @subcategory_ID, @brand_ID,@Arrayof_Subcategory)
    `);
};


// Get product by ID
exports.getProductById = async (id) => {
  const pool = await sql.connect(config);
  const result= await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM Products WHERE id = @id');
  const prod=result.recordset[0];
  if(prod.imageCover){
    prod.imageCover=`${BASE_URL}/products/${prod.imageCover}`;
  }
  if(prod?.images){
    try{
      const parsedImages=JSON.parse(prod.images);
      prod.images=parsedImages.map(img=>`${BASE_URL}/products/${img}`);
    }catch(err){
      prod.images=[];
    }

  }
  return result;
};

// Update product

exports.updateProduct = async (
  id,
  {
    title,
    description,
    quantity,
    price,
    priceAfterDiscount,
    imageCover,
    images,
    colors,
    category_ID,
    subcategory_ID,
    brand_ID,
    Arrayof_Subcategory,
  }
) => {
  const pool = await sql.connect(config);
  const request = pool.request();

  request.input("id", sql.Int, id);

  const fields = [];

  if (title !== undefined) {
    request.input("title", sql.NVarChar, title);
    const slug = slugify(title, { lower: true, strict: true });
    request.input("slug", sql.NVarChar, slug);
    fields.push("title = @title", "slug = @slug");
  }

  if (description !== undefined) {
    request.input("description", sql.NVarChar, description);
    fields.push("description = @description");
  }

  if (quantity !== undefined) {
    request.input("quantity", sql.Int, quantity);
    fields.push("quantity = @quantity");
  }

  if (price !== undefined) {
    request.input("price", sql.Decimal(10, 2), price);
    fields.push("price = @price");
  }

  if (priceAfterDiscount !== undefined) {
    request.input("priceAfterDiscount", sql.Decimal(10, 2), priceAfterDiscount);
    fields.push("priceAfterDiscount = @priceAfterDiscount");
  }

  if (imageCover !== undefined) {
    request.input("imageCover", sql.NVarChar, imageCover);
    fields.push("imageCover = @imageCover");
  }

  if (images !== undefined) {
    request.input("images", sql.NVarChar, JSON.stringify(images));
    fields.push("images = @images");
  }
// if (typeof colors === 'string') {
//   try {
//     colors = JSON.parse(colors); // فك السلسلة إلى Array
//   } catch (err) {
//     // لو فشل الفتح، تجاهل أو رجع null
//     colors = null;
//   }
// }
  if (colors !== undefined) {
    request.input("colors", sql.NVarChar, JSON.stringify(colors));
    fields.push("colors = @colors");
  }

  if (category_ID !== undefined) {
    request.input("category_ID", sql.Int, category_ID);
    fields.push("category_ID = @category_ID");
  }

  if (subcategory_ID !== undefined) {
    request.input("subcategory_ID", sql.Int, subcategory_ID);
    fields.push("subcategory_ID = @subcategory_ID");
  }

  if (Arrayof_Subcategory !== undefined) {
    request.input("Arrayof_Subcategory", sql.NVarChar, JSON.stringify(Arrayof_Subcategory));
    fields.push("Arrayof_Subcategory = @Arrayof_Subcategory");
  }

  if (brand_ID !== undefined) {
    request.input("brand_ID", sql.Int, brand_ID);
    fields.push("brand_ID = @brand_ID");
  }

  // دائمًا نحدث التاريخ
  fields.push("updated_Date = GETDATE()");

  const query = `
    UPDATE Products
    SET ${fields.join(", ")}
    WHERE id = @id
  `;

  const result = await request.query(query);
  return result;
};

/*
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
    .input('images', sql.NVarChar, images?JSON.stringify(images):null)
    .input('colors', sql.NVarChar, colors?JSON.stringify(colors):null)
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
};*/

// Delete product
exports.deleteProduct = async (id) => {
  const pool = await sql.connect(config);
  return await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM Products WHERE id = @id');
};

exports.getAllProducts = async (page, limit, whereStatement, sortStatement) => {
  const skip = (page - 1) * limit;
  const pool = await sql.connect(config);

  const result = await pool.request()
    .input('skip', sql.Int, skip)
    .input('limit', sql.Int, limit)
    .query(`
      SELECT 
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
        STUFF((
          SELECT ',' + sub.Name
          FROM STRING_SPLIT(REPLACE(REPLACE(ISNULL(p.Arrayof_Subcategory, ''), '[', ''), ']', ''), ',') AS splitted
          JOIN subcategory sub ON TRY_CAST(splitted.value AS INT) = sub.id
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
      OFFSET @skip ROWS FETCH NEXT @limit ROWS ONLY;
    `);

  const BASE_URL = process.env.BASE_URL || "http://localhost:9000";

  if (!result?.recordset || !Array.isArray(result.recordset)) {
    return { count: 0, data: [] };
  }

  const products = result.recordset.map(prd => {
    // معالجة imageCover
    if (prd.imageCover) {
      prd.imageCover = `${BASE_URL}/products/${prd.imageCover}`;
    }

    // معالجة images
    if (prd?.images) {
      try {
        const parsedImages = JSON.parse(prd.images);
        prd.images = Array.isArray(parsedImages)
          ? parsedImages.map(img => `${BASE_URL}/products/${img}`)
          : [];
      } catch (err) {
        prd.images = [];
      }
    }

    // معالجة colors
    if (prd?.colors) {
      try {
        const parsedColors = JSON.parse(prd.colors);
        prd.colors = Array.isArray(parsedColors) ? parsedColors : [];
      } catch (err) {
        prd.colors = [];
      }
    }

    // معالجة Arrayof_Subcategory
    if (prd?.Arrayof_Subcategory) {
      try {
        const parsedArray = JSON.parse(prd.Arrayof_Subcategory);
        prd.Arrayof_Subcategory = Array.isArray(parsedArray) ? parsedArray : [];
      } catch (err) {
        prd.Arrayof_Subcategory = [];
      }
    }

    return prd;
  });

  return { count: products.length, data: products };
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