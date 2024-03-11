// console.log("hello world");
// setTimeout(() => {
// 	console.log("delay!");
// }, 1000);
import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
const token = process.env.TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	const channel = client.channels.cache.get("480479508164771864");
	if (channel === undefined || !channel.isTextBased()) {
		console.log("channel is wrong");
		process.exit();
	} else {
		// channel.messages.fetch();
		const messagePromise = channel.send("content :)").catch(() => {
			console.log("oopsies!");
			process.exit();
		});
		console.log((await messagePromise).id);
		// .then((mess) => {
		// 	console.log(mess);
		// 	process.exit();
		// });
	}
});

// Log in to Discord with your client's token
client.login(token);
