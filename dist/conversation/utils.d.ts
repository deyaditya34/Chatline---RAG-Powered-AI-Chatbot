import { type Entity } from "../types/output.js";
import { type ConversationRecord } from "../types/conversations.js";
import { type Content } from "@google/genai";
export declare function sanitizeConversation(data: string, entity: Entity): Content;
export declare function createConversationRecord(): ConversationRecord;
export declare function sanitizeAndPrintConversation(conversation: ConversationRecord): void;
//# sourceMappingURL=utils.d.ts.map