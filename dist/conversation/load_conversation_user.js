import fs from "fs";
import path from "path";
import { userConversationsDir } from "../config/path.js";
import {} from "../types/conversations.js";
export function loadConversationUser(convName) {
    const conversationHistoryUser = fs.readFileSync(path.join(userConversationsDir, convName));
    let parsedConversationHistoryUser = JSON.parse(conversationHistoryUser.toString());
    return parsedConversationHistoryUser;
}
//# sourceMappingURL=load_conversation_user.js.map