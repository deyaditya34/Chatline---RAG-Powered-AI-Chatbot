import fs from "fs";
import path from "path";
import { USER_CONVERSATIONS_DIR, MODEL_CONVERSATIONS_DIR } from "../config/path.js";

export async function store_conversation_file(
	conv_name,
	conv_history_user,
	conv_history_model
) {

	fs.writeFileSync(
		path.join(USER_CONVERSATIONS_DIR, conv_name),
		JSON.stringify(conv_history_user)
	);

	fs.writeFileSync(
		path.join(MODEL_CONVERSATIONS_DIR, conv_name),
		JSON.stringify(conv_history_model)
	);
}
