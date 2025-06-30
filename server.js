
const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const { dbConnection } = require('./config/database');
const productRoute=require('./Routes/productRoute');


dotenv.config({path:'config2.env'});

const app=express();
app.use(express.json());


if(process.env.NODE_ENV ==='development_33'){
    app.use(morgan('dev'));
    console.log(`node:${process.env.NODE_ENV}`);
    
}
//طباعه فقط
dbConnection();

app.use('/pr',productRoute);
app.get('/',(req,res)=>{
    res.send('MY API 99');
});


const PORT=process.env.PORT ||9000;
app.listen(PORT,()=>{
    console.log(`app running on port ${PORT}`);
});
