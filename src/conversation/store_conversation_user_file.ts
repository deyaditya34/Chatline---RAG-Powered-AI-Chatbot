import fs from "fs";
import path from "path";
import { userConversationsDir } from "../config/path.js";
import type { ConversationRecord } from "../types/conversations.js";

export async function storeConversationUserFile(
	convName: string,
	convHistoryUser: ConversationRecord,
) {

	fs.writeFileSync(
		path.join(userConversationsDir, convName),	
		JSON.stringify(convHistoryUser)
	);
}
