const path=require('path');
const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const { dbConnection } = require('./config/database');
dotenv.config({ path: 'config2.env' });
const categoryRoute=require('./Routes/categoryRoute');
const subcategoryRoute=require('./Routes/subcategoryRoute');
const brandsRoute=require('./Routes/brandsRoute');
const ProductsRoute=require('./Routes/ProductsRoute');
const userRoute=require('./Routes/userRoute');
const authRoute=require('./Routes/authRoute');
const ApiError=require('./utils/apiError');
const globalError=require('./middlewares/ErrorMiddleware');
const cors=require('cors')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'uploads')));
app.use(express.static(path.join(__dirname,'public')));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`node:${process.env.NODE_ENV}`);
}
 app.use('/pr', categoryRoute);//category
 app.use('/subpr',subcategoryRoute);//subcategory
 app.use('/br',brandsRoute);
 app.use('/products',ProductsRoute);
 app.use('/us',userRoute);
 app.use('/auth',authRoute);

app.get('/', (req, res) => {
  res.send('MY API 99');
});
app.get('/favicon.ico', (req, res) => res.status(204).end());


app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
// ✅ middleware لمعالجة الأخطاء
// Global error handling middleware for express
app.use(globalError);

// ✅ تشغيل السيرفر في الآخر بعد تعريف كل شيء
const PORT = process.env.PORT || 9000;

const server =app.listen(PORT,()=>{
  console.log(`app running on port ${PORT}`);
})
dbConnection();


// سيناريو خطأ غير معالج:
async function doSomething() {
  throw new Error('error i make');
}

//doSomething(); // ❌ ما فيش try/catch

//Events => listen =callback(err)
// الكود التالي هيتعامل مع الخطأ اللي فوق
// Hendle Error rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`❌ unhandledRejection ${err.message}`);
  server.close(()=>{
    console.error(`shutting down .....................`);
    process.exit(1);
  });
});
