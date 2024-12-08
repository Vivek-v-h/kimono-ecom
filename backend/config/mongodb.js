import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,  // Wait for 10 seconds before timing out
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);  // Exit if database connection fails
    }
};

export default connectDB;
