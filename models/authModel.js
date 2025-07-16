 const {sql,config}=require('../config/database');
 const slugify=require('slugify');
const bcrypt=require('bcryptjs');

 exports.insertUserTosinup = async ({ name, email, password, phone,}) => {
  const pool = await sql.connect(config);
  const slug = slugify(name, { lower: true, strict: true });
  const hashedPassword=await bcrypt.hash(password,12);
  const safeRole =  'user';
  const safeActive = true;
  const result= await pool.request()
    .input('name', sql.NVarChar, name)
    .input('slug', sql.NVarChar, slug)
    .input('password', sql.NVarChar, hashedPassword)
    .input('phone', sql.NVarChar, phone)
    .input('email', sql.NVarChar, email)
    .input('role', sql.NVarChar, safeRole)
    .input('active', sql.Bit, safeActive) // استخدم Bit بدل Boolean
    .query(`INSERT INTO users (name, slug, password, phone, email, role, active)
           OUTPUT INSERTED.*
      VALUES (@name, @slug, @password, @phone, @email, @role, @active)`);
return result;
    };

  exports.finduserByEmail = async (email) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
  //.input('id', sql.Int, id)
    .input('email', sql.NVarChar, email)
    .query('SELECT id,password ,email,passwordChangedAt FROM users WHERE  email=@email');
  return result.recordset[0];
};
