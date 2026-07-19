import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
import { type ConversationRecord } from "../types/conversations.js";

export function storeConversationFile(
	convName: string,
	convHistoryUser: ConversationRecord,
	convHistoryModel: ConversationRecord
): void {

	fs.writeFileSync(
		path.join(userConversationsDir, convName),
		JSON.stringify(convHistoryUser)
	);

	fs.writeFileSync(
		path.join(modelConversationsDir, convName),
		JSON.stringify(convHistoryModel)
	);
}
