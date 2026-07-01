import { Client } from "@elastic/elasticsearch";
import { ELASTIC_SEARCH_INDEX } from "../config/database.js";

const client = new Client({
	node: "http://127.0.0.1:9200"
});

export async function create_index() {
	try {
		const exists = await client.indices.exists(
			{ index: ELASTIC_SEARCH_INDEX }
		)

		if (!exists) {
			await client.indices.create(
				{ index: index_name }
			);

			console.log(`Index '${ELASTIC_SEARCH_INDEX}' created`);
			console.log(`Index '${ELASTIC_SEARCH_INDEX}' initialized`);
		} else {
			console.log(`Index '${ELASTIC_SEARCH_INDEX}' initialized`);
		}
	} catch (err) {
		console.error(err);
	}
}

export async function insert_document(document) {
	const response = await client.index({
		index: ELASTIC_SEARCH_INDEX,
		document
	});

	return response;
}

export async function search_document(user_query, size = 5) {
	const response = await client.search({
		index: ELASTIC_SEARCH_INDEX,
		size,
		query: {
			match: {
				text: user_query
			}
		}
	})

	return response.hits.hits;
}

export async function search_documents(
	user_query,
	conversation_id,
	source,
	size = 5
) {
	const response = await client.search({
		index: ELASTIC_SEARCH_INDEX,
		size,
		query: {
			bool: {
				must: [
					{
						match: {
							text: user_query
						}
					}
				],
				filter: [
					{
						term: {
							"conversation_id.keyword": conversation_id
						}
					},
					{
						term: {
							"source_type.keyword": source
						}
					}
				]
			}
		}
	});

	return response.hits.hits;
}

export async function get_indices() {
	const response = await client.indices.getMapping({
		index: ELASTIC_SEARCH_INDEX
	});

	return response;
}

export async function delete_conversation(conversation_id) {
	const response = await client.deleteByQuery({
		index: ELASTIC_SEARCH_INDEX,
		query: {
			bool: {
				filter: [
					{
						term: {
							"conversation_id.keyword": conversation_id
						}
					}
				]
			}
		}
	})

	return response;
}

export async function delete_document(document_id) {
	const response = await client.delete({
		index: ELASTIC_SEARCH_INDEX,
		id: document_id
	})

	return response;
}

export async function delete_index() {
	const response = await client.indices.delete({
		index: ELASTIC_SEARCH_INDEX
	});

	return response;
}
