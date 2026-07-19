import { type Content } from "@google/genai";
export interface UploadDocument {
    fileName: string;
    documentId: string;
    uploadedAt: number;
}
export interface ConversationRecord {
    contents: Content[];
    modelVersion: string;
    tokenLimitExceededOnce: boolean;
    uploadDocuments: UploadDocument[];
}
export interface ConversationHistory {
    parsedConversationHistoryUser: ConversationRecord;
    parsedConversationHistoryModel: ConversationRecord;
}
//# sourceMappingURL=conversations.d.ts.map