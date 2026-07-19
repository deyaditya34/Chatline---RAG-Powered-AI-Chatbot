import { type ElasticDocument } from "../types/elasticDb.js";
import type { DeleteByQueryResponse, DeleteResponse, IndexResponse, IndicesDeleteResponse, IndicesGetMappingResponse } from "@elastic/elasticsearch/lib/api/types";
export declare function createIndex(): Promise<void>;
export declare function insertDocument(document: ElasticDocument): Promise<IndexResponse>;
export declare function searchDocument(userQuery: string, size?: number): Promise<import("@elastic/elasticsearch/lib/api/types").SearchHit<unknown>[]>;
export declare function searchDocuments(userQuery: string, conversationId: string, source: string, size?: number): Promise<import("@elastic/elasticsearch/lib/api/types").SearchHit<ElasticDocument>[]>;
export declare function getIndices(): Promise<IndicesGetMappingResponse>;
export declare function deleteConversation(conversationId: string): Promise<DeleteByQueryResponse>;
export declare function deleteDocument(documentId: string): Promise<DeleteResponse>;
export declare function deleteIndex(): Promise<IndicesDeleteResponse>;
//# sourceMappingURL=elastic_search.d.ts.map