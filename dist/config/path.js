import path from "path";
import { DATA_DIR, CONVERSATIONS_DIR, INTERACTIONS_DIR, USER_CONVERSATIONS_DIR, MODEL_CONVERSATIONS_DIR } from "../config/env.js";
export const dataDir = DATA_DIR;
export const conversationsDir = path.join(dataDir, CONVERSATIONS_DIR);
export const interactionsDir = path.join(dataDir, INTERACTIONS_DIR);
export const userConversationsDir = path.join(conversationsDir, USER_CONVERSATIONS_DIR);
export const modelConversationsDir = path.join(conversationsDir, MODEL_CONVERSATIONS_DIR);
//# sourceMappingURL=path.js.map