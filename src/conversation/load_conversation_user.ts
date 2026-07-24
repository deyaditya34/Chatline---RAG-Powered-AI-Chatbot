import fs from "fs";
import path from "path";
import { userConversationsDir } from "../config/path.js";
import { type ConversationRecord } from "../types/conversations.js";
import { wrapError } from "../errors/wrapError.js";
import { FileError } from "../errors/file_error.js";

export function loadConversationUser(convName: string): ConversationRecord {
	try {
		const conversationHistoryUser = fs.readFileSync(
			path.join(userConversationsDir, convName)
		);
		let parsedConversationHistoryUser = JSON.parse(
			conversationHistoryUser.toString()
		);

		return parsedConversationHistoryUser
	} catch (err) {
		wrapError(err, FileError, "failed to read conversation history of user")
	}
}
