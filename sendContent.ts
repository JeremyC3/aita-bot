import { Client, TextChannel, EmbedBuilder, Embed } from "discord.js";
import { serverPromises } from "./delayServer";
import { Aita } from "./models/models";

const relReacts = ["🔥"];
const run = async () => {
	const client = (await serverPromises)[0] as Client<boolean>;
	// pull a unposted post, then create the new embed based on it.
	const randomPost = await Aita.aggregate([
		{ $match: { datePosted: null } },
		{ $sample: { size: 1 } },
	]);
	if (randomPost.length == 0) {
		console.log("no posts");
		process.exit();
	}
	const post = randomPost[0];
	const aitaPost = new EmbedBuilder()
		.setTitle(post.title)
		.setDescription(post.text)
		.setURL(post.url);

	// pull discord channel info out
	const channel = client.channels.cache.get(
		"480479508164771864"
	) as TextChannel;

	// after posting, record the post date as the datePosted, get the postID.
	// after posting 1. update mongo with date, 2. add 3 reacts in
	channel.send({ embeds: [aitaPost] }).then(async (channelPost) => {
		const id = channelPost.id;
		await Aita.findOneAndUpdate(
			{ url: post.url },
			{ postId: id, datePosted: new Date() }
		).then(() => console.log("donezo"));
	});
};
run();
