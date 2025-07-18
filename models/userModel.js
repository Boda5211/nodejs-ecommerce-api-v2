 const {sql,config}=require('../config/database');
 const slugify=require('slugify');
const bcrypt=require('bcryptjs');

 exports.insertUser = async ({ name, email, password, phone, role, active }) => {
  const pool = await sql.connect(config);
  const slug = slugify(name, { lower: true, strict: true });
  const hashedPassword=await bcrypt.hash(password,12);
  const safeRole = role !== undefined ? role : 'user';
  const safeActive = String(active).toLowerCase() === 'false' ? false : true;
  return await pool.request()
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
};

 exports.getAllUsers = async (page, limit) => {
  const pool = await sql.connect(config);
  const skip = (page - 1) * limit;
  const result = await pool.request()
    .input('skip', sql.Int, skip)
    .input('limit', sql.Int, limit)
    .query(`SELECT * FROM users 
            ORDER BY id 
            OFFSET @skip ROWS FETCH NEXT @limit ROWS ONLY`);
  return { recordset: result.recordset };
};
exports.getUserByIdREcord = async (id) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM users WHERE id = @id');
  return result.recordset[0];
};
exports.getUserById = async (id) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM users WHERE id = @id');
  return result;
};
exports.CheckUnickEmail = async (email) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT email FROM users WHERE email = @email');
  return result.recordset[0];
};
exports.CheckUnickEmailonupdate = async (email,id) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
  .input('id', sql.Int, id)
    .input('email', sql.NVarChar, email)
    .query('SELECT email FROM users WHERE email = @email And id!=@id');
  return result.recordset[0];
};
//currpassword,password = @password And
exports.CheckcurrentPass = async (id) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
  .input('id', sql.Int, id)
   // .input('password', sql.NVarChar, currpassword)
    .query('SELECT password FROM users WHERE  id=@id');
  return result.recordset[0];
};
exports.searchUsersByName = async (keyword) => {
  const pool = await sql.connect(config);
  return await pool.request()
    .input('keyword', sql.NVarChar, `%${keyword}%`)
    .query('SELECT * FROM users WHERE name LIKE @keyword');
};
exports.updateUser = async (id, { name, email, password, phone ,role,active}) => {
  const pool = await sql.connect(config);
  const request = pool.request().input('id', sql.Int, id);

  if (name) {
    request.input('name', sql.NVarChar, name);
    const slug = slugify(name, { lower: true, strict: true });
    request.input('slug', sql.NVarChar, slug);
  }
 /*if (email) request.input('email', sql.NVarChar, email);
  if (password) {
    const hashed=await bcrypt.hash(password,12);
    request.input('password', sql.NVarChar, hashed);
  }*/
    if (phone) request.input('phone', sql.NVarChar, phone);
  if(role) request.input('role',sql.NVarChar,role);
  if(active) request.input('active',sql.Boolean,active);
  const updateFields = [
    name ? 'name = ISNULL(@name, name), slug = ISNULL(@slug, slug)' : '',
   // email ? 'email = ISNULL(@email, email)' : '',
    //password ? 'password = ISNULL(@password, password)' : '',
    phone ? 'phone = ISNULL(@phone, phone)' : '',
    role ?'role =isnull(@role,role)':'',
    active ? 'active =isnull(@active,active)' :''
  ].filter(Boolean).join(', ');

  const query = `UPDATE users SET ${updateFields} ,[ubdatedate]=getdate() WHERE id = @id`;

  return await request.query(query);
};

exports.changepass=async(id,{password})=>{
    const pool =await sql.connect(config);
    
    const request = pool.request().input('id', sql.Int, id);
    if (password) {
    const hashed=await bcrypt.hash(password,12);
    request.input('password', sql.NVarChar, hashed);
  }
    const updateResult= await request
    .input('passwordChangedAt', new Date())
    .query(`UPDATE users SET password = ISNULL(@password, password), 
      passwordChangedAt = @passwordChangedAt ,[ubdatedate]=getdate() where id=@id`);
    
    return updateResult;
}
exports.deleteUser = async (id) => {
  const pool = await sql.connect(config);
  return await pool.request()
    .input('id', sql.Int, id)
    .query('DELETE FROM users WHERE id = @id');
};
