import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("DB Connected")
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/trackify`);
}

export default connectDB;


//use below format if we connect mongodb using Driver Connection String

// import mongoose from "mongoose";

// const connectDB = async () => {
//     try {
//         mongoose.connection.on('connected', () => {
//             console.log("DB Connected");
//         });

//         await mongoose.connect(process.env.MONGODB_URI, { dbName: "trackify" });
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//     }
// };

// export default connectDB;
