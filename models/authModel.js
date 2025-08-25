 const {sql,config}=require('../config/database');
 const slugify=require('slugify');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
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
    .input('passNOthash', sql.NVarChar, password)
    .input('phone', sql.NVarChar, phone)
    .input('email', sql.NVarChar, email)
    .input('role', sql.NVarChar, safeRole)
    .input('active', sql.Bit, safeActive) // استخدم Bit بدل Boolean
    .query(`INSERT INTO users (name, slug, password, phone, email, role, active,passNOthash)
           OUTPUT INSERTED.*
      VALUES (@name, @slug, @password, @phone, @email, @role, @active,@passNOthash)`);
return result;
    };

  exports.finduserByEmail = async (email) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
  //.input('id', sql.Int, id)
    .input('email', sql.NVarChar, email)
    .query('SELECT id,password ,email,passwordChangedAt,name FROM users WHERE  email=@email');
  return result.recordset[0];
};

exports.setResetCode=async(email)=>{
  const pool=await sql.connect(config);
  const resetCode=Math.floor(100000+Math.random()*900000).toString();
  const hasedrestCode=crypto.createHash('sha256').update(resetCode).digest('hex');
  const expires=new Date(Date.now()+20*60*1000);
  await pool.request()
    .input('code', sql.NVarChar, hasedrestCode)
    .input('passNOthash', sql.NVarChar, resetCode)
    .input('expires', sql.DateTime, expires)
    .input('verified', sql.Bit, false)
    .input('email', sql.NVarChar, email)
    .query(`
      UPDATE users 
      SET 
        passwordResetCode = @code, 
        passNOthash = @passNOthash, 
        passwordResetExpires = @expires, 
        passwordResetVerified = @verified 
      WHERE email = @email
    `);
      return resetCode;
};
exports.setResetCodeFeald=async(email)=>{
  const pool=await sql.connect(config);
  const resetCode=null;
  const hasedrestCode=null;
  const expires=null;
  await pool.request()
    .input('code', sql.NVarChar, hasedrestCode)
    .input('passNOthash', sql.NVarChar, resetCode)
    .input('expires', sql.DateTime, expires)
    .input('verified', sql.Bit, false)
    .input('email', sql.NVarChar, email)
    .query(`
      UPDATE users 
      SET 
        passwordResetCode = @code, 
        passNOthash = @passNOthash, 
        passwordResetExpires = @expires, 
        passwordResetVerified = @verified 
      WHERE email = @email
    `);
      return resetCode;
};

exports.verifyResetCode=async(resetcode)=>{
  const pool=await sql.connect(config);
  const hasedrestCode=crypto.createHash('sha256').update(resetcode)
  .digest('hex');
const result= await pool.request()
.input('resetCode',sql.NVarChar,hasedrestCode)
.query(`select * from users where 
  passwordResetCode=@resetCode and passwordResetExpires > GETDATE() 
  and passwordResetVerified =0`)
return result.recordset[0];
}

exports.updateAfterResetCode=async(id)=>{
  const pool=await sql.connect(config);
const result= await pool.request()
.input('id',sql.Int,id)
 .input('verified', sql.Bit, true)
.query(`UPDATE users 
      SET 
        passwordResetVerified = @verified
      WHERE id = @id`);
return result.rowsAffected[0]>0;
}

exports.changepassAfterRc=async(id,password)=>{
    const pool =await sql.connect(config);
    const request = pool.request().input('id', sql.Int, id);
   let hashed;
    if (password) {
     hashed=await bcrypt.hash(password,12);
  }
  request.input('password', sql.NVarChar, hashed);
    const updateResult= await request
    .input('passwordChangedAt', new Date())
    .query(`UPDATE users 
      SET password = ISNULL(@password, password), 
      passwordChangedAt = @passwordChangedAt 
      ,passwordResetVerified=null
       ,[passwordResetCode]=null
      ,[passwordResetExpires]=null
      ,[passNOthash]=null
      ,[ubdatedate]=getdate() where id=@id`);
    return updateResult;
}

exports.checkVerifyByemail = async (email) => {
  const pool = await sql.connect(config);
  const result = await pool.request()
  //.input('id', sql.Int, id)//and passwordResetVerified =1
    .input('email', sql.NVarChar, email)
    .query('SELECT id,passwordResetVerified FROM users WHERE  email=@email ');
  return result.recordset[0];
};