import { Client } from "@elastic/elasticsearch";
import { elasticSearchIndex } from "../config/database.js";
import { type ElasticDocument } from "../types/elasticDb.js";
import type { DeleteByQueryResponse, DeleteResponse, IndexResponse, IndicesDeleteResponse, IndicesGetMappingResponse } from "@elastic/elasticsearch/lib/api/types";
import { wrapError } from "../errors/wrapError.js";
import { DatabaseError } from "../errors/database_error.js";

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
		wrapError(err, DatabaseError, "failed to create index in elastic DB");
	}
}

export async function insertDocument(document: ElasticDocument): Promise<IndexResponse> {
	try {
		const response = await client.index({
			index: elasticSearchIndex,
			document
		});

		return response;
	} catch (err) {
		wrapError(err, DatabaseError, "failed to insert document in elastic DB");
	}
}

export async function searchDocument(userQuery: string, size = 5) {
	try {
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
	} catch (err) {
		wrapError(err, DatabaseError, "failed to search document in Elastic DB");
	}
}

export async function searchDocuments(
	userQuery: string,
	conversationId: string,
	source: string,
	size = 5
) {
	try {
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
	} catch (err) {
		wrapError(err, DatabaseError, "failed to search documents in elastic DB");
	}
}

export async function getIndices(): Promise<IndicesGetMappingResponse> {
	try {
		const response = await client.indices.getMapping({
			index: elasticSearchIndex
		});

		return response;
	} catch (err) {
		wrapError(err, DatabaseError, "failed to get indices of the elastic DB");
	}
}

export async function deleteConversation(conversationId: string): Promise<DeleteByQueryResponse> {
	try {
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
	} catch (err) {
		wrapError(err, DatabaseError, "failed to delete conversation in elastic DB");
	}
}

export async function deleteDocument(documentId: string): Promise<DeleteResponse> {
	try {
		const response = await client.delete({
			index: elasticSearchIndex,
			id: documentId
		})

		return response;
	} catch (err) {
		wrapError(err, DatabaseError, "failed to delete document in elastic DB");
	}
}

export async function deleteIndex(): Promise<IndicesDeleteResponse> {
	try {
		const response = await client.indices.delete({
			index: elasticSearchIndex
		});

		return response;
	} catch (err) {
		wrapError(err, DatabaseError, "failed to delete index in elastic DB");
	}
}

