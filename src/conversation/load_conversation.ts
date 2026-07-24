import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
import { type ConversationHistory } from "../types/conversations.js";
import { wrapError } from "../errors/wrapError.js";
import { FileError } from "../errors/file_error.js";

export function loadConversation(convName: string): ConversationHistory {
	try {
		const conversationHistoryUser = fs.readFileSync(
			path.join(userConversationsDir, convName)
		);
		let parsedConversationHistoryUser = JSON.parse(
			conversationHistoryUser.toString()
		);

		const conversationHistoryModel = fs.readFileSync(
			path.join(modelConversationsDir, convName)
		);
		let parsedConversationHistoryModel = JSON.parse(
			conversationHistoryModel.toString()
		);

		return {
			parsedConversationHistoryUser,
			parsedConversationHistoryModel
		};
	} catch (err) {
		wrapError(err, FileError, "failed to read conversation history")
	}
}
