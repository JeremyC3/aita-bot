const mongoose = require("mongoose");
import dotenv from "dotenv";
dotenv.config();

main()
	.then(() => console.log("connected to mongoDB!"))
	.catch((err) => console.log(err));

async function main() {
	await mongoose.connect(process.env.MONGO_URI);
}
