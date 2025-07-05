    /*const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
//const { dbConnection } = require('./config/database');
const productRoute=require('./Routes/productRoute');

dotenv.config({path:'config2.env'});

const app=express();
app.use(express.json());

if(process.env.NODE_ENV ==='development_33'){
    app.use(morgan('dev'));
    console.log(`node:${process.env.NODE_ENV}`);
    
}
//طباعه فقط
//dbConnection();

app.use('/pr',productRoute);
app.get('/',(req,res)=>{
    res.send('MY API 99');
});




app.all('*', (req, res, next) => {
    const err = new Error(`Can't find this route: ${req.originalUrl}`);
    next(err); // ✅ تمرير كائن الخطأ نفسه
});

// global error handlig middleware
    app.use((err,req,res,next)=>{
        res.status(500).json({message:err.message});
    });
    
    const PORT=process.env.PORT ||9000;
    app.listen(PORT,()=>{
        console.log(`app running on port ${PORT}`);
    });
const slugify = require('slugify');
    
    const title = "أفضل 10 طرق لتعلم البرمجة في 2025";
const slug = slugify(title, { lower: true, strict: true });

console.log(slug); // afdl-10-trq-ltaalm-lbrmjh-fy-2025*/

const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
//const { dbConnection } = require('./config/database');
const productRoute=require('./Routes/productRoute');
dotenv.config({ path: 'config2.env' });

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development_33') {
  app.use(morgan('dev'));
  console.log(`node:${process.env.NODE_ENV}`);
}

// ✅ المسارات
app.use('/pr', productRoute);

// ✅ راوت اختبار رئيسي
app.get('/', (req, res) => {
  res.send('MY API 99');
});

// ✅ التعامل مع الراوتات الغير معرفة
// app.all('*', (req, res, next) => {
//   const err = new Error(`Can't find this route: ${req.originalUrl}`);
//   next(err);
// });

// // ✅ ميدل وير معالجة الأخطاء
// app.use((err, req, res, next) => {
//   res.status(500).json({ message: err.message });
// });
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find this route: ${req.originalUrl}`);
  next(err); // مهم جدًا
});

// ✅ middleware لمعالجة الأخطاء
app.use((err, req, res, next) => {
  const message = err?.message || 'Unexpected error';
  res.status(500).json({ message });
});

// ✅ تشغيل السيرفر في الآخر بعد تعريف كل شيء
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
