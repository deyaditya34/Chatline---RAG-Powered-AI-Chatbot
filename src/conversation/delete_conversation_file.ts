import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
import { wrapError } from "../errors/wrapError.js";
import { FileError } from "../errors/file_error.js";

export async function deleteConversationFile(convName: string): Promise<void> {

	const convFileUser = path.join(userConversationsDir, convName);
	const convFileModel = path.join(modelConversationsDir, convName);

	try {
		fs.unlinkSync(convFileUser);
		fs.unlinkSync(convFileModel);
	} catch (err) {
		wrapError(err, FileError, "failed to delete conversation file");
	}
}
