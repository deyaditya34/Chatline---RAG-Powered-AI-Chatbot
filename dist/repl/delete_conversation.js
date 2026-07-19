import { deleteConversationDb } from "../conversation/delete_conversation_db.js";
import { deleteConversationFile } from "../conversation/delete_conversation_file.js";
import { printMessage } from "../cli/output.js";
export async function deleteConversation(convName) {
    await deleteConversationDb(convName);
    await deleteConversationFile(convName);
    printMessage(`conversation - '${convName}' deleted`);
}
//# sourceMappingURL=delete_conversation.js.map