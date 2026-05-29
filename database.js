import fs from "fs";
import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from "uuid";

const qdrant = new QdrantClient({
	url: "http://localhost:6333"
});

export async function create_collection() {
	const collections = await qdrant.getCollections();

	if (collections.collections.length > 0) {
		console.log("initialized database")
	} else {
		await qdrant.createCollection(process.env.DATABASE_COLLECTION_NAME, {
			vectors: {
				size: 3072,
				distance: "Cosine"
			}
		});

		console.log("collection created");
		console.log("initialized database");
	}
}

export async function insert_document(document) {
	const result = await qdrant.upsert(process.env.DATABASE_COLLECTION_NAME,
		{
			wait: true,
			points: [
				{
					id: uuidv4(),
					vector: document.embedding,
					payload: document.payload
				}
			]
		}
	)

	return result;
}

export async function search_documents(embedding, conversation_id, source_type) {
	const result = await qdrant.search(process.env.DATABASE_COLLECTION_NAME,
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
	const result = await qdrant.scroll(process.env.DATABASE_COLLECTION_NAME, {
		limit: 100
	});
	console.log(JSON.stringify(result, null, 2));

}

export async function delete_document(criteria = {}) {
	const result = await qdrant.delete(process.env.DATABASE_COLLECTION_NAME, {
		filter: criteria
	});

	return result;
}
