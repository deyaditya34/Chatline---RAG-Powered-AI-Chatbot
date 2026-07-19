import { type ConversationRecord, type ConversationHistory } from "../types/conversations.js";
export declare function enforceTokenLimit(parsedConversationHistoryUser: ConversationRecord, parsedConversationHistoryModel: ConversationRecord, userPromptEmbedding: number[], userResponse: string, convName: string): Promise<ConversationHistory>;
//# sourceMappingURL=enforce_token_limit.d.ts.map