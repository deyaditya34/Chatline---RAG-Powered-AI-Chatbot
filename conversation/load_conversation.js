import fs from "fs";
import path from "path";
import { USER_CONVERSATIONS_DIR, MODEL_CONVERSATIONS_DIR } from "../config/path.js";

export async function load_conversation(conv_name) {

	const conversation_history_user = fs.readFileSync(
		path.join(USER_CONVERSATIONS_DIR, conv_name)
	);
	let parsed_conversation_history_user = JSON.parse(
		conversation_history_user.toString()
	);

	const conversation_history_model = fs.readFileSync(
		path.join(MODEL_CONVERSATIONS_DIR, conv_name)
	);
	let parsed_conversation_history_model = JSON.parse(
		conversation_history_model.toString()
	);


	return {
		parsed_conversation_history_user,
		parsed_conversation_history_model
	};
}
