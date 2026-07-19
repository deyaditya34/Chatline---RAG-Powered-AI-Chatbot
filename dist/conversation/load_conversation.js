import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
import {} from "../types/conversations.js";
export function loadConversation(convName) {
    const conversationHistoryUser = fs.readFileSync(path.join(userConversationsDir, convName));
    let parsedConversationHistoryUser = JSON.parse(conversationHistoryUser.toString());
    const conversationHistoryModel = fs.readFileSync(path.join(modelConversationsDir, convName));
    let parsedConversationHistoryModel = JSON.parse(conversationHistoryModel.toString());
    return {
        parsedConversationHistoryUser,
        parsedConversationHistoryModel
    };
}
//# sourceMappingURL=load_conversation.js.map