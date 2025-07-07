const sql =require ('mssql');
const dotenv = require('dotenv');
dotenv.config({path:'config2.env'});
const config={
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};
const dbConnection=async()=>{
   try{
        const pool =await sql.connect(config);
        console.log(`connected to sql server at ${config.server}`);
        return pool;
    }catch(err){
        console.error(`❌ Database connection error`,err);
        process.exit(1);
    }
};
module.exports = { dbConnection, config, sql };










