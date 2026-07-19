import fs from "fs";
import { printList, printMessage } from "../cli/output.js";
import { userConversationsDir } from "../config/path.js";
export function listConversation() {
    const conversation_list = fs.readdirSync(userConversationsDir);
    if (!conversation_list.length) {
        printMessage("no existing conversation found");
        return;
    }
    printList(conversation_list);
}
//# sourceMappingURL=list_conversations.js.map