import { type Schemas } from "@qdrant/js-client-rest";
import { type Document, type SearchResult } from "../types/vectorDb.js";
export declare function createCollection(): Promise<void>;
export declare function insertDocuments(documents: Document[]): Promise<Schemas["UpdateResult"]>;
export declare function searchCollection(embedding: number[]): Promise<Schemas["ScoredPoint"][]>;
export declare function searchDocuments(embedding: number[], conversationId: string, sourceType: string): Promise<SearchResult[]>;
export declare function scrollDocument(): Promise<void>;
export declare function deleteDocument(criteria?: {}): Promise<Schemas["UpdateResult"]>;
export declare function deleteCollection(): Promise<Boolean>;
//# sourceMappingURL=qdrant.d.ts.map