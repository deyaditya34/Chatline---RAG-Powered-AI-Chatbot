import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import readline from "readline";
import { embed_content } from "../ai_model.js";
import { print_output, sanitize_conversation } from "../utils.js";
import { insert_document } from "../database.js";

export async function embed_document(doc_path, conv_id) {
	const chat_topic = conv_id;
	let conversation_history_user;
	let conversation_history_model;

	const chat_save_dir_for_user =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;

	try {
		conversation_history_user = fs.readFileSync(`${chat_save_dir_for_user}/${chat_topic}`);
	} catch (err) {
		console.error("error in retrieving conversation", err);
		return;
	}

	let parsed_conversation_history_user = JSON.parse(conversation_history_user.toString());

	let document_details = {
		file_name: doc_path,
		document_id: uuidv4(),
		uploaded_at: Date.now(),
		source_type: "document"
	}

	parsed_conversation_history_user.uploadedDocuments.push(document_details);

	const input_stream = fs.createReadStream(doc_path);

	const rl = readline.createInterface({
		input: input_stream,
		crlfDelay: Infinity
	});

	let paragraph = "";

	for await (const line of rl) {
		//empty line means paragraph ended
		if (line.trim() === "") {
			if (paragraph.trim()) {

				const result = await embed_content(sanitize_conversation(paragraph, "user"));
				const embedding = result.embedding.values;

				let chunk_details = {
					conversation_id: chat_topic,
					source_type: document_details.source_type,
					document_id: document_details.document_id,
					uploaded_at: document_details.uploaded_at,
					text: paragraph,
					embedding: embedding
				}

				const document_insert = await insert_document(
					{
						embedding: chunk_details.embedding,
						payload: {
							text: chunk_details.text,
							conversation_id: chunk_details.conversation_id,
							document_id: chunk_details.document_id,
							source_type: chunk_details.source_type,
							uploaded_at: chunk_details.uploaded_at
						}
					}
				)

				paragraph = "";
			}
		} else {
			paragraph += line + "\n";
		}
	}

	if (paragraph.trim()) {
		const result = await embed_content(sanitize_conversation(paragraph, "user"));
		const embedding = result.embedding.values;

		let chunk_details = {
			conversation_id: chat_topic,
			document_id: document_details.document_id,
			text: paragraph,
			embedding: embedding,
			source_type: document_details.source_type
		}

		const document_insert = await insert_document(
			{
				embedding: chunk_details.embedding,
				payload: {
					text: chunk_details.text,
					conversation_id: chunk_details.conversation_id,
					document_id: chunk_details.document_id,
					source_type: chunk_details.source_type
				}
			}
		)
	}

	print_output(
		`file - '${doc_path}' embedding completed.`,
		process.env.MODEL_DISPLAY_NAME,
		"embedding"
	)

	fs.writeFileSync(`${chat_save_dir_for_user}/${chat_topic}`,
		JSON.stringify(parsed_conversation_history_user)
	);
}


//const document_search = await search_documents(embedding);

//console.log("insert document result -", document_search);

/*
TO DO
--------
1. user asks the model
2. conversation create
3. save the user prompt
4. reply as usual till the token limit is reached or the user doesn't upload a file
5. once step 4 happens

1. entire conversation or the uploaded file is embedded and converted to vector
2. user asks the model
3. user query converted to embedding
4. the embedding is used to search in the vector DB for semantic data
5. the semantic data along with the user prompt is sent to the ai model
6. ai model response is to be saved and the normal process will continue till the token limit is reached again
*/
