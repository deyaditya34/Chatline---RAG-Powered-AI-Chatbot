import fs from "fs";
import path from "path";
import { USER_CONVERSATIONS_DIR, MODEL_CONVERSATIONS_DIR } from "../config/path.js";
import { create_conversation_record } from "../utils.js";

export async function initialize_conversation(conv_name) {

	const initital_conversation_boilerplate = create_conversation_record();
	fs.writeFileSync(
		path.join(USER_CONVERSATIONS_DIR, conv_name),
		JSON.stringify(initital_conversation_boilerplate)
	);	

	fs.writeFileSync(
		path.join(MODEL_CONVERSATIONS_DIR, conv_name),
		JSON.stringify(initital_conversation_boilerplate)
	); 
}
