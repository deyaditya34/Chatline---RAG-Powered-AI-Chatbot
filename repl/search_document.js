import { embed_content } from "../ai_model.js";
import { sanitize_conversation } from "../utils.js";
import { search_collection } from "../databases/qdrant.js";
import { current_conversation_id } from "../session.js";

export async function search_document(semantic_search) {
	const embedding_result = await embed_content(sanitize_conversation(semantic_search, "user"));
	const embedding = embedding_result.embedding.values;

	try {
		const search_result = await search_collection(embedding);
		console.log("search result -", search_result);
	} catch (err) {
		console.error(err.message);
	}
}
