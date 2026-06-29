import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from "uuid";
import { QDRANT_COLLECTION } from "../config/database.js";

const qdrant = new QdrantClient({
	url: "http://localhost:6333"
});

export async function create_collection() {
	const collections = await qdrant.getCollections();

	if (collections.collections.length > 0) {
		console.log("initialized qdrant database")
	} else {
		await qdrant.createCollection(QDRANT_COLLECTION, {
			vectors: {
				size: 3072,
				distance: "Cosine"
			}
		});

		console.log("collection created in qdrant database");
		console.log("initialized qdrant database");
	}
}

export async function insert_documents(documents) {
	const points = documents.map((doc) => ({
		id: uuidv4(),
		vector: doc.embedding,
		payload: doc.payload
	}));

	const result = await qdrant.upsert(QDRANT_COLLECTION,
		{
			wait: true,
			points: points
		}
	)

	return result;
}

export async function search_collection(embedding) {
	const result = await qdrant.search(QDRANT_COLLECTION,
		{
			vector: embedding,
			filter: {}
		}
	)

	return result;
};

export async function search_documents(embedding, conversation_id, source_type) {
	const result = await qdrant.search(QDRANT_COLLECTION,
		{
			vector: embedding,
			filter: {
				must: [
					{
						key: "conversation_id",
						match: {
							value: conversation_id
						}
					},
					{
						key: "source_type",
						match: {
							value: source_type
						}
					}
				]
			}
		}
	);

	return result;
}

export async function scroll_document() {
	const result = await qdrant.scroll(QDRANT_COLLECTION, {
		limit: 100
	});
	console.log(JSON.stringify(result, null, 2));
}

export async function delete_document(criteria = {}) {
	const result = await qdrant.delete(QDRANT_COLLECTION, {
		filter: criteria
	});

	return result;
}

export async function delete_collection() {
	const result = await qdrant.deleteCollection(QDRANT_COLLECTION);

	return result;
}
