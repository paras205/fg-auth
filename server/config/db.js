const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});
		console.log(`Database connected: ${connection.connection.host}`);
	} catch (err) {
		console.log(err);
	}
};
module.exports = connectDB;
