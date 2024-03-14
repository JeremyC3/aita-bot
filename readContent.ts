import { Client, TextChannel } from "discord.js";
import { serverPromises } from "./delayServer";
import { Aita } from "./models/models";

const relReacts = { "🇳": "nta", "🇾": "yta", "🇪": "esh" }; // take the relevant reactions and save them

const run = async () => {
	const client = (await serverPromises)[0] as Client<boolean>;
	const channel = client.channels.cache.get(
		"480479508164771864" // this is my personal value and needs to be changed
	) as TextChannel;
	const latest = await Aita.find({})
		.where({ datePosted: { $ne: null } })
		.sort({ datePosted: "desc" })
		.limit(1);
	const recentPost = latest[0];
	console.log(recentPost.postId);
	if (recentPost.postId == undefined) {
		console.log("mistake happened here");
		process.exit();
	}
	channel.messages
		.fetch(recentPost.postId) // change to the latest post ID
		.then(async (msg) => {
			// first filter to just the reactions I care about
			// next, filter to get the user reactions
			const reactDict: Record<string, string[]> = {};
			for (const [reaction, key] of Object.entries(relReacts)) {
				const emoji = msg.reactions.cache.get(reaction);
				const userIter = await emoji?.users.fetch();
				const userArr = userIter == undefined ? [] : [...userIter.keys()];

				reactDict[key] = userArr;
			}
			console.log(reactDict);
			await Aita.findOneAndUpdate(
				{ postId: recentPost.postId },
				{ nta: reactDict["nta"], yta: reactDict["yta"], esh: reactDict["esh"] }
			);
			console.log("update complete");
		})
		.catch((err) => console.log(err));
	console.log("done");
};
run();
