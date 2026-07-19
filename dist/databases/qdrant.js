import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from "uuid";
import { qdrantCollection } from "../config/database.js";
import {} from "../types/vectorDb.js";
import { isPayload } from "./utils.js";
const qdrant = new QdrantClient({
    url: "http://localhost:6333"
});
export async function createCollection() {
    const collections = await qdrant.getCollections();
    if (collections.collections.length > 0) {
        console.log("initialized qdrant database");
    }
    else {
        await qdrant.createCollection(qdrantCollection, {
            vectors: {
                size: 3072,
                distance: "Cosine"
            }
        });
        console.log("collection created in qdrant database");
        console.log("initialized qdrant database");
    }
}
export async function insertDocuments(documents) {
    const points = documents.map((doc) => ({
        id: uuidv4(),
        vector: doc['embedding'],
        payload: doc['payload']
    }));
    const result = await qdrant.upsert(qdrantCollection, {
        wait: true,
        points: points
    });
    return result;
}
export async function searchCollection(embedding) {
    const result = await qdrant.search(qdrantCollection, {
        vector: embedding,
        filter: {}
    });
    return result;
}
;
export async function searchDocuments(embedding, conversationId, sourceType) {
    const result = await qdrant.search(qdrantCollection, {
        vector: embedding,
        filter: {
            must: [
                {
                    key: "conversationId",
                    match: {
                        value: conversationId
                    }
                },
                {
                    key: "sourceType",
                    match: {
                        value: sourceType
                    }
                }
            ]
        }
    });
    return result.flatMap(point => {
        if (!isPayload(point.payload)) {
            return [];
        }
        return [
            {
                score: point.score,
                payload: point.payload
            }
        ];
    });
}
export async function scrollDocument() {
    const result = await qdrant.scroll(qdrantCollection, {
        limit: 100
    });
    console.log(JSON.stringify(result, null, 2));
}
export async function deleteDocument(criteria = {}) {
    const result = await qdrant.delete(qdrantCollection, {
        filter: criteria
    });
    return result;
}
export async function deleteCollection() {
    const result = await qdrant.deleteCollection(qdrantCollection);
    return result;
}
//# sourceMappingURL=qdrant.js.map