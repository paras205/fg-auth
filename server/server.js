const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config({ path: './config/config.env' });

const app = express();
// database connection
const connectDB = require('./config/db');
connectDB();

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');

app.use('/api/v1/users', authRoutes);

app.use((req, res, next) => {
	res.status(400).json({
		success: false,
		message: 'page not found'
	});
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
