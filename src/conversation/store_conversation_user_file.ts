import fs from "fs";
import path from "path";
import { userConversationsDir } from "../config/path.js";
import type { ConversationRecord } from "../types/conversations.js";
import { wrapError } from "../errors/wrapError.js";
import { AiError } from "../errors/ai_error.js";

export async function storeConversationUserFile(
	convName: string,
	convHistoryUser: ConversationRecord,
) {
	try {
		fs.writeFileSync(
			path.join(userConversationsDir, convName),
			JSON.stringify(convHistoryUser)
		);
	} catch (err) {
		wrapError(err, AiError, "failed to write user conversation history")
	};
}
