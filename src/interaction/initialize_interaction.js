import fs from "fs";
import path from "path";
import { create_interaction_record } from "./utils.js";
import { INTERACTIONS_DIR } from "../config/path.js";

export async function initialize_interaction(conv_name) {

	const initital_interaction_boilerplate = create_interaction_record();

	fs.writeFileSync(
		path.join(INTERACTIONS_DIR, conv_name),
		JSON.stringify(initital_interaction_boilerplate)
	);	
}
