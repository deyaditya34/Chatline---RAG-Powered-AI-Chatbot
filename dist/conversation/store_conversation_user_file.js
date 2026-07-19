import fs from "fs";
import path from "path";
import { userConversationsDir } from "../config/path.js";
export async function storeConversationUserFile(convName, convHistoryUser) {
    fs.writeFileSync(path.join(userConversationsDir, convName), JSON.stringify(convHistoryUser));
}
//# sourceMappingURL=store_conversation_user_file.js.map