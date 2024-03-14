// console.log("hello world");
// setTimeout(() => {
// 	console.log("delay!");
// }, 1000);
import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.TOKEN;

//create mongoDB instance
const mongo_URI = process.env.MONGO_URI ?? "oops";
const mongooseProm = mongoose.connect(mongo_URI);

// Create a new client instance
const clientProm = new Promise((resolve, reject) => {
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	// When the client is ready, run this code (only once).
	// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
	// It makes some properties non-nullable.
	client.once(Events.ClientReady, (readyClient) => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
		resolve(client);
	});

	// Log in to Discord with your client's token
	client.login(token);
	setTimeout(() => {
		reject("this took too long");
	}, 10000);
});
const serverPromises = Promise.all([clientProm, mongooseProm]);
export { serverPromises };
