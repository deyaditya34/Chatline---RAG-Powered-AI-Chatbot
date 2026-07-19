import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
export async function deleteConversationFile(convName) {
    const convFileUser = path.join(userConversationsDir, convName);
    const convFileModel = path.join(modelConversationsDir, convName);
    try {
        fs.unlinkSync(convFileUser);
        fs.unlinkSync(convFileModel);
    }
    catch (err) {
        console.log("err in deleting file -", err);
    }
}
//# sourceMappingURL=delete_conversation_file.js.map