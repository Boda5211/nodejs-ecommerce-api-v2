const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { dbConnection } = require('./config/database');
const { saveproduct } = require('./Controllers/productService');
const productRoute = require('./Routes/productRoute');

dotenv.config({ path: 'config.env' });

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

dbConnection();

//Mount Routes
app.use('/api/v1/product',productRoute);
// app.post('/product', saveproduct);

app.get('/', (req, res) => {
    res.send('OUR API');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
