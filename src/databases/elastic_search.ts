import { Client } from "@elastic/elasticsearch";
import { elasticSearchIndex } from "../config/database.js";
import { type ElasticDocument } from "../types/elasticDb.js";
import type { DeleteByQueryResponse, DeleteResponse, IndexResponse, IndicesDeleteResponse, IndicesGetMappingResponse } from "@elastic/elasticsearch/lib/api/types";

const client = new Client({
	node: "http://127.0.0.1:9200"
});

export async function createIndex(): Promise<void> {
	try {
		const exists = await client.indices.exists(
			{ index: elasticSearchIndex }
		)

		if (!exists) {
			await client.indices.create(
				{ index: elasticSearchIndex }
			);

			console.log(`Index '${elasticSearchIndex}' created`);
			console.log(`Index '${elasticSearchIndex}' initialized`);
		} else {
			console.log(`Index '${elasticSearchIndex}' initialized`);
		}
	} catch (err) {
		console.error(err);
	}
}

export async function insertDocument(document: ElasticDocument): Promise<IndexResponse> {
	const response = await client.index({
		index: elasticSearchIndex,
		document
	});

	return response;
}

export async function searchDocument(userQuery: string, size = 5) {
	const response = await client.search({
		index: elasticSearchIndex,
		size,
		query: {
			match: {
				text: userQuery
			}
		}
	})

	return response.hits.hits;
}

export async function searchDocuments(
	userQuery: string,
	conversationId: string,
	source: string,
	size = 5
) {
	const response = await client.search<ElasticDocument>({
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

export async function getIndices(): Promise<IndicesGetMappingResponse> {
	const response = await client.indices.getMapping({
		index: elasticSearchIndex
	});

	return response;
}

export async function deleteConversation(conversationId: string): Promise<DeleteByQueryResponse> {
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
	})

	return response;
}

export async function deleteDocument(documentId: string): Promise<DeleteResponse> {
	const response = await client.delete({
		index: elasticSearchIndex,
		id: documentId
	})

	return response;
}

export async function deleteIndex(): Promise<IndicesDeleteResponse> {
	const response = await client.indices.delete({
		index: elasticSearchIndex
	});

	return response;
}
