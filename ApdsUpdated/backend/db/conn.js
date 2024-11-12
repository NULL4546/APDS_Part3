import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
const ATLAS_URI = process.env.ATLAS_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('connected ${MONGO_URI}');
    } catch (err) {
        console.error('failed to connect to ${MONGO_URI}: ${err.message}');
        console.log('trying to connect to ${ATLAS_URI}');
        try {
            await mongoose.connect(ATLAS_URI);
            console.log('connected ${ATLAS_URI}');
        } catch (err) {
            console.error('failed to connect to MONGODB', err);
            process.exit(1);
        } 
    }
}
export default connectDB;