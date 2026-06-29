import fs from "fs";
import path from "path";
import { USER_CONVERSATIONS_DIR } from "../config/path.js";

export async function load_conversation_user(conv_name) {

	const conversation_history_user = fs.readFileSync(
		path.join(USER_CONVERSATIONS_DIR, conv_name)
	);
	let parsed_conversation_history_user = JSON.parse(
		conversation_history_user.toString()
	);

	return parsed_conversation_history_user
}
