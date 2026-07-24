import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
import { type ConversationRecord } from "../types/conversations.js";
import { wrapError } from "../errors/wrapError.js";
import { FileError } from "../errors/file_error.js";

export function storeConversationFile(
	convName: string,
	convHistoryUser: ConversationRecord,
	convHistoryModel: ConversationRecord
): void {
	try {
		fs.writeFileSync(
			path.join(userConversationsDir, convName),
			JSON.stringify(convHistoryUser)
		);

		fs.writeFileSync(
			path.join(modelConversationsDir, convName),
			JSON.stringify(convHistoryModel)
		);
	} catch (err) {
		wrapError(err, FileError, "failed to write conversation history")
	}
}
