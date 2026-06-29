import fs from "fs";
import path from "path";
import { INTERACTIONS_DIR } from "../config/path.js";

export async function delete_interaction_file(conv_name) {

	const conv_file = path.join(INTERACTIONS_DIR, conv_name);

	try {
		await fs.unlinkSync(conv_file);
	} catch (err) {
		console.log("err in deleting file -", err);
	}
}
