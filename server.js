
const express=require('express');
const dotenv=require('dotenv');
const morgan=require('morgan');
const { dbConnection } = require('./config/database');
dotenv.config({ path: 'config2.env' });
const productRoute=require('./Routes/productRoute');
const ApiError=require('./utils/apiError');
const globalError=require('./middlewares/ErrorMiddleware');

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`node:${process.env.NODE_ENV}`);
}
 app.use('/pr', productRoute);

app.get('/', (req, res) => {
  res.send('MY API 99');
});


app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
// ✅ middleware لمعالجة الأخطاء
// Global error handling middleware for express
app.use(globalError);

// ✅ تشغيل السيرفر في الآخر بعد تعريف كل شيء
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
dbConnection();


