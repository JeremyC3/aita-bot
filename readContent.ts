import { Client, TextChannel } from "discord.js";
import { serverPromises } from "./delayServer";
import { Aita } from "./models/models";

const relReacts: Record<string, string> = {
	"🇳": "nta",
	"🇾": "yta",
	"🇪": "esh",
}; // take the relevant reactions and save them

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

	// after finding the post, remove bot reactions and then tally up the totals
	const finished = channel.messages
		.fetch(recentPost.postId) // change to the latest post ID
		.then(async (msg) => {
			console.log("fetch done");
			// first filter to just the reactions I care about
			// next, filter to get the user reactions
			const reactDict: Record<string, string[]> = {};
			// track duplicates here
			const dupes: Set<string> = new Set();
			const cornCobs: Set<string> = new Set();
			for (const key of ["🇾", "🇪", "🇳"]) {
				console.log("in key line");
				const emoji = msg.reactions.cache.get(key);
				const userIter = await emoji?.users.fetch();
				const tempArr: string[] = [];
				if (userIter !== undefined) {
					for (const [user, _] of userIter) {
						if (dupes.has(user)) {
							cornCobs.add(user);
						} else {
							tempArr.push(user);
							dupes.add(user);
						}
					}
				}
				// const stringified = relReacts[key];
				reactDict[relReacts[key]] = tempArr;
			}
			// post the ratios, and update the ratios in the database.
			await Aita.findOneAndUpdate(
				{ postId: recentPost.postId },
				{ nta: reactDict["nta"], yta: reactDict["yta"], esh: reactDict["esh"] }
			);

			console.log("update complete");
		})
		.catch((err) => {
			console.log("oopsies");
			console.log(err);
		});
	await finished;
	console.log("done");
	process.exit();
};
run();
