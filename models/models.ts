import mongoose, { Schema } from "mongoose";

interface IAita {
	title: string;
	text: string;
	url: string;
	datePosted?: Date;
	postId?: string;
	reactions?: Record<string, string>;
	yta?: string[];
	nta?: string[];
	esh?: string[];
	nah?: string[];
}

// first category is to do is store each post made
// next thing is to store all the reactions to each post
const aitaSchema = new Schema<IAita>({
	title: { type: String },
	text: { type: String },
	url: { type: String, unique: true },
	datePosted: { type: Date }, // date of my actual posting
	postId: { type: String }, // track the post when it's made
	reactions: { type: Map, of: [String] }, // arr of IDs for each
	yta: { type: [String] },
	nta: { type: [String] },
	esh: { type: [String] },
	nah: { type: [String] },
});

// later on, I need to then create a repo of a bunch of posts for my own use

const Aita = mongoose.model("Aita", aitaSchema);

export { Aita };
