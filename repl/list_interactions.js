import fs from "fs";
import { read_user_input } from "../readline.js";
import { print_list } from "../utils.js";
import { INTERACTIONS_DIR } from "../config/path.js";

export async function list_interaction() {

	const interaction_list = await fs.readdirSync(INTERACTIONS_DIR);

	if (!interaction_list.length) {
		console.log("no existing interaction found");
		return;
	}

	print_list(interaction_list);
}
