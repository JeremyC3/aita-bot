import { Client, TextChannel, EmbedBuilder } from "discord.js";
import { serverPromises } from "./delayServer";
import { Aita } from "./models/models";

const relReacts: Record<string, string> = {
	"🇳": "nta",
	"🇾": "yta",
	"🇪": "esh",
	"🥱": "nah",
}; // take the relevant reactions and save them

const run = async () => {
	const client = (await serverPromises)[0] as Client<boolean>;
	const channel = client.channels.cache.get(
		"684868831814222019" // this is my personal value and needs to be changed
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
			const dupes: Set<string> = new Set("1204486225709236295");
			const cornCobs: Set<string> = new Set();
			for (const key of ["🇾", "🇪", "🇳", "🥱"]) {
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
				{
					nta: reactDict["nta"],
					yta: reactDict["yta"],
					esh: reactDict["esh"],
					nah: reactDict["nah"],
				}
			);
			const totalReacts = dupes.size - 1;
			const aitaPost = new EmbedBuilder()
				.setTitle("Today's AITA results:")
				.setDescription(
					"note: for multiple reactions from the same user, the folloiwng priority will be used: yta > nta > esh > nah"
				)
				.addFields(
					{
						name: "YTA:",
						value: `${reactDict["yta"].length / totalReacts}`,
						inline: true,
					},
					{
						name: "NTA:",
						value: `${reactDict["nta"].length / totalReacts}`,
						inline: true,
					},
					{
						name: "ESH:",
						value: `${reactDict["esh"].length / totalReacts}`,
						inline: true,
					},
					{
						name: "NAH:",
						value: `${reactDict["nah"].length / totalReacts}`,
						inline: true,
					}
				);
			channel.send({ embeds: [aitaPost] });
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
