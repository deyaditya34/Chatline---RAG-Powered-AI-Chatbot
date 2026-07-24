import { QdrantClient, type Schemas } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from "uuid";
import { qdrantCollection } from "../config/database.js";
import { type Document, type SearchResult } from "../types/vectorDb.js";
import { isPayload } from "./utils.js";
import { wrapError } from "../errors/wrapError.js";
import { DatabaseError } from "../errors/database_error.js";

const qdrant = new QdrantClient({
	url: "http://localhost:6333"
});

export async function createCollection(): Promise<void> {
	try {
		const collections: Schemas['CollectionsResponse'] = await qdrant.getCollections();

		if (collections.collections.length > 0) {
			console.log("initialized qdrant database")
		} else {
			await qdrant.createCollection(qdrantCollection, {
				vectors: {
					size: 3072,
					distance: "Cosine"
				}
			});

			console.log("collection created in qdrant database");
			console.log("initialized qdrant database");
		}
	} catch (err) {
		wrapError(err, DatabaseError, "failed to create collection in vector DB");
	}
}

export async function insertDocuments(documents: Document[]): Promise<Schemas["UpdateResult"]> {
	try {
		const points = documents.map((doc) => ({
			id: uuidv4(),
			vector: doc['embedding'],
			payload: doc['payload']
		}));

		const result = await qdrant.upsert(qdrantCollection,
			{
				wait: true,
				points: points
			}
		)

		return result;
	} catch (err) {
		wrapError(err, DatabaseError, "failed to insert document in vector DB");
	}
}

export async function searchCollection(embedding: number[]): Promise<Schemas["ScoredPoint"][]> {
	try {
		const result = await qdrant.search(qdrantCollection,
			{
				vector: embedding,
				filter: {}
			}
		)

		return result;
	} catch (err) {
		wrapError(err, DatabaseError, "failed to search collection in vector DB");
	}
};

export async function searchDocuments(
	embedding: number[],
	conversationId: string,
	sourceType: string
): Promise<SearchResult[]> {
	try {
		const result = await qdrant.search(qdrantCollection,
			{
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
			}
		);

		return result.flatMap(point => {
			if (!isPayload(point.payload)) {
				return []
			}

			return [
				{
					score: point.score,
					payload: point.payload
				}
			]
		});
	} catch (err) {
		wrapError(err, DatabaseError, "failed to search documents in vector DB");
	}
}

export async function scrollDocument(): Promise<void> {
	try {
		const result: Schemas["ScrollResult"] = await qdrant.scroll(qdrantCollection, {
			limit: 100
		});
		console.log(JSON.stringify(result, null, 2));
	} catch (err) {
		wrapError(err, DatabaseError, "failed to scroll document in vector DB");
	}
}

export async function deleteDocument(criteria = {}): Promise<Schemas["UpdateResult"]> {
	try {
		const result = await qdrant.delete(qdrantCollection, {
			filter: criteria
		});

		return result;
	} catch (err) {
		wrapError(err, DatabaseError, "failed to delete document in vector DB");
	}
}

export async function deleteCollection(): Promise<Boolean> {
	try {
	const result = await qdrant.deleteCollection(qdrantCollection);

	return result;
	} catch (err) {
		wrapError(err, DatabaseError, "failed to delete collection in vector DB");
	}
}

