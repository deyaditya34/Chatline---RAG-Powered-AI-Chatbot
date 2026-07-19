import type { Entity } from "./output.ts";
export type Payload = ConversationPayload | UploadDocumentPayload;
export interface BasePayload {
    text: string;
    conversationId: string;
    uploadedAt: number;
    [key: string]: unknown;
}
export interface Document {
    embedding: number[];
    payload: ConversationPayload | UploadDocumentPayload;
}
export interface SearchResult {
    score: number;
    payload: ConversationPayload | UploadDocumentPayload;
}
export interface ConversationPayload extends BasePayload {
    sourceType: "conversation";
    role: Entity;
}
export interface UploadDocumentPayload extends BasePayload {
    sourceType: "document";
    documentId: string;
}
//# sourceMappingURL=vectorDb.d.ts.map