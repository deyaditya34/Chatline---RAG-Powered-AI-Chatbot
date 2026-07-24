import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
import { createConversationRecord } from "./utils.js";
import { wrapError } from "../errors/wrapError.js";
import { FileError } from "../errors/file_error.js";

export function initializeConversation(convName: string): void {
	try {
		const inititalConversationBoilerplate = createConversationRecord();
		fs.writeFileSync(
			path.join(userConversationsDir, convName),
			JSON.stringify(inititalConversationBoilerplate)
		);

		fs.writeFileSync(
			path.join(modelConversationsDir, convName),
			JSON.stringify(inititalConversationBoilerplate)
		);
	} catch (err) {
		wrapError(err, FileError, "failed to create conversation record")
	}
}
