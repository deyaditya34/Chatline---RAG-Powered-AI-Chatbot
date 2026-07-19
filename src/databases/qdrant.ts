import { QdrantClient, type Schemas } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from "uuid";
import { qdrantCollection } from "../config/database.js";
import { type Document, type SearchResult } from "../types/vectorDb.js";
import { isPayload } from "./utils.js";

const qdrant = new QdrantClient({
	url: "http://localhost:6333"
});

export async function createCollection(): Promise<void> {
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
}

export async function insertDocuments(documents: Document[]): Promise<Schemas["UpdateResult"]> {
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
}

export async function searchCollection(embedding: number[]): Promise<Schemas["ScoredPoint"][]> {
	const result = await qdrant.search(qdrantCollection,
		{
			vector: embedding,
			filter: {}
		}
	)

	return result;
};

export async function searchDocuments(
	embedding: number[],
	conversationId: string,
	sourceType: string
): Promise<SearchResult[]> {
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
}

export async function scrollDocument(): Promise<void> {
	const result: Schemas["ScrollResult"] = await qdrant.scroll(qdrantCollection, {
		limit: 100
	});
	console.log(JSON.stringify(result, null, 2));
}

export async function deleteDocument(criteria = {}): Promise<Schemas["UpdateResult"]> {
	const result = await qdrant.delete(qdrantCollection, {
		filter: criteria
	});

	return result;
}

export async function deleteCollection(): Promise<Boolean> {
	const result = await qdrant.deleteCollection(qdrantCollection);

	return result;
}

