import type { Entity } from "./output.ts";
export interface BaseDocument {
    text: string;
    conversationId: string;
    uploadedAt: number;
}
export interface ConversationDocument extends BaseDocument {
    sourceType: "conversation";
    role: Entity;
}
export interface UploadDocument extends BaseDocument {
    sourceType: "document";
    documentId: string;
}
export type ElasticDocument = ConversationDocument | UploadDocument;
//# sourceMappingURL=elasticDb.d.ts.map