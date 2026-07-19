import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
import {} from "../types/conversations.js";
export function storeConversationFile(convName, convHistoryUser, convHistoryModel) {
    fs.writeFileSync(path.join(userConversationsDir, convName), JSON.stringify(convHistoryUser));
    fs.writeFileSync(path.join(modelConversationsDir, convName), JSON.stringify(convHistoryModel));
}
//# sourceMappingURL=store_conversation_file.js.map