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
  subcategory_ID = null,
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
    .input('category_ID', sql.Int, category_ID)
    .input('subcategory_ID', sql.Int, subcategory_ID ?? null)
    .input('brand_ID', sql.Int, brand_ID ?? null)
    .query(`
      INSERT INTO Products
        (title, slug, description, quantity, price, priceAfterDiscount, imageCover, images, colors, category_ID, subcategory_ID, brand_ID)
      VALUES
        (@title, @slug, @description, @quantity, @price, @priceAfterDiscount, @imageCover, @images, @colors, @category_ID, @subcategory_ID, @brand_ID)
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
exports.updateProduct = async (id, { title, description, quantity, price, priceAfterDiscount, imageCover, images, colors, category_ID, subcategory_ID, brand_ID }) => {
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

exports.getAllProducts = async () => {
  const pool = await sql.connect(config);
  return await pool.request().query(`SELECT * FROM Products ORDER BY id`);
};