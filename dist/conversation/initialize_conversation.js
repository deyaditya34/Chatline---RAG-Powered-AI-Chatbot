import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
import { createConversationRecord } from "./utils.js";
export function initializeConversation(convName) {
    const inititalConversationBoilerplate = createConversationRecord();
    fs.writeFileSync(path.join(userConversationsDir, convName), JSON.stringify(inititalConversationBoilerplate));
    fs.writeFileSync(path.join(modelConversationsDir, convName), JSON.stringify(inititalConversationBoilerplate));
}
//# sourceMappingURL=initialize_conversation.js.map