require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const stripe = require('stripe')(process.env.SECRET_KEY);

//requiring routes middlewares
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment');

//middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// DB connectivity
mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('db connected!'); //TYPE = myfun.run().then().catch();
	});

//my routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);

//PORT
const port = process.env.PORT || 8000;

//starting server
app.listen(port, () => {
	console.log(`app is running at port ${port}...`);
});
