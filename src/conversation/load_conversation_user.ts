import fs from "fs";
import path from "path";
import { userConversationsDir } from "../config/path.js";
import { type ConversationRecord } from "../types/conversations.js";

export function loadConversationUser(convName: string): ConversationRecord {

	const conversationHistoryUser = fs.readFileSync(
		path.join(userConversationsDir, convName)
	);
	let parsedConversationHistoryUser = JSON.parse(
		conversationHistoryUser.toString()
	);

	return parsedConversationHistoryUser
}
