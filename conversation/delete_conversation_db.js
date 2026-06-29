import * as vector_store from "../databases/qdrant.js";
import * as elastic_store from "../databases/elastic_search.js";

export async function delete_conversation_db(conv_name) {
	const semantic_delete_criteria = {
		must: [
			{
				key: "conversation_id",
				match: {
					value: conv_name
				}
			}
		]
	}

	await vector_store.delete_document(semantic_delete_criteria);

	await elastic_store.delete_conversation(conv_name);

}
