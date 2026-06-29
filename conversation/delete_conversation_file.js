import fs from "fs";
import path from "path";
import { USER_CONVERSATIONS_DIR, MODEL_CONVERSATIONS_DIR } from "../config/path.js";

export async function delete_conversation_file(conv_name) {

	const conv_file_user = path.join(USER_CONVERSATIONS_DIR, conv_name);
	const conv_file_model = path.join(MODEL_CONVERSATIONS_DIR, conv_name);

	try {
		await fs.unlinkSync(filePath_user);
		await fs.unlinkSync(filePath_model);
	} catch (err) {
		console.log("err in deleting file -", err);
	}
}
