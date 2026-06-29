import fs from "fs";
import path from "path";
import { INTERACTIONS_DIR } from "../config/path.js";

export async function load_interaction(conv_name) {

	const interaction_history = fs.readFileSync(
		path.join(INTERACTIONS_DIR, conv_name)
	);

	let parsed_interaction_history = JSON.parse(
		conv_history_user.toString()
	);

	return parsed_interaction_history;
}
