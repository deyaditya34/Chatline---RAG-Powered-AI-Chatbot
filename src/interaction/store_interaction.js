import fs from "fs";
import path from "path";
import { INTERACTIONS_DIR } from "../config/path.js";

export async function store_interaction(conv_name, interaction_history) {

	fs.writeFileSync(
		path.join(INTERACTIONS_DIR, conv_name),
		JSON.stringify(interaction_history)
	);
}
