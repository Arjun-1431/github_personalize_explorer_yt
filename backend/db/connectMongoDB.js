import mongoose from "mongoose";

export default async function connectMongoDB() {
	try {
		await mongoose.connect("mongodb+srv://anujsingh32085:123@github.cefr4.mongodb.net/?retryWrites=true&w=majority&appName=github");
		console.log("MONGODB atlas connected");
	} catch (error) {
		console.log("Error connecting to MongoDB: ", error.message);
	}
}
