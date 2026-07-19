import { Client } from "@elastic/elasticsearch";
import { elasticSearchIndex } from "../config/database.js";
import {} from "../types/elasticDb.js";
const client = new Client({
    node: "http://127.0.0.1:9200"
});
export async function createIndex() {
    try {
        const exists = await client.indices.exists({ index: elasticSearchIndex });
        if (!exists) {
            await client.indices.create({ index: elasticSearchIndex });
            console.log(`Index '${elasticSearchIndex}' created`);
            console.log(`Index '${elasticSearchIndex}' initialized`);
        }
        else {
            console.log(`Index '${elasticSearchIndex}' initialized`);
        }
    }
    catch (err) {
        console.error(err);
    }
}
export async function insertDocument(document) {
    const response = await client.index({
        index: elasticSearchIndex,
        document
    });
    return response;
}
export async function searchDocument(userQuery, size = 5) {
    const response = await client.search({
        index: elasticSearchIndex,
        size,
        query: {
            match: {
                text: userQuery
            }
        }
    });
    return response.hits.hits;
}
export async function searchDocuments(userQuery, conversationId, source, size = 5) {
    const response = await client.search({
        index: elasticSearchIndex,
        size,
        query: {
            bool: {
                must: [
                    {
                        match: {
                            text: userQuery
                        }
                    }
                ],
                filter: [
                    {
                        term: {
                            "conversationId.keyword": conversationId
                        }
                    },
                    {
                        term: {
                            "sourceType.keyword": source
                        }
                    }
                ]
            }
        }
    });
    return response.hits.hits;
}
export async function getIndices() {
    const response = await client.indices.getMapping({
        index: elasticSearchIndex
    });
    return response;
}
export async function deleteConversation(conversationId) {
    const response = await client.deleteByQuery({
        index: elasticSearchIndex,
        query: {
            bool: {
                filter: [
                    {
                        term: {
                            "conversationId.keyword": conversationId
                        }
                    }
                ]
            }
        }
    });
    return response;
}
export async function deleteDocument(documentId) {
    const response = await client.delete({
        index: elasticSearchIndex,
        id: documentId
    });
    return response;
}
export async function deleteIndex() {
    const response = await client.indices.delete({
        index: elasticSearchIndex
    });
    return response;
}
//# sourceMappingURL=elastic_search.js.map