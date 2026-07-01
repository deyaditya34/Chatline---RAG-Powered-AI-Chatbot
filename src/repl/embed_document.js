import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import readline from "readline";
import { print_output, sanitize_conversation } from "../utils.js";
import { load_conversation_user } from "../conversation/load_conversation_user.js";
import { create_embedding } from "../embedding/create_embedding.js";
import { store_uploaded_doc } from "../conversation/store_uploaded_doc.js";
import { store_conversation_user_file } from "../conversation/store_conversation_user_file.js";

export async function embed_document(doc_path, conv_name) {

	let parsed_conversation_history_user = await load_conversation_user(conv_name);

	let document_details = {
		file_name: doc_path,
		document_id: uuidv4(),
		uploaded_at: Date.now(),
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

				const sanitized_document_chunk = sanitize_conversation(paragraph, "user");
				const embedding = await create_embedding(sanitized_document_chunk);

				await store_uploaded_doc(
					conv_name,
					document_details.document_id,
					document_details.uploaded_at,
					paragraph,
					embedding
				);

				paragraph = "";
			}
		} else {
			paragraph += line + "\n";
		}
	}

	if (paragraph.trim()) {
		const sanitized_document_chunk = sanitize_conversation(paragraph, "user");
		const embedding = await create_embedding(sanitized_document_chunk);

		await store_uploaded_doc(
			conv_name,
			document_details.document_id,
			document_details.uploaded_at,
			paragraph,
			embedding
		);
	}

	print_output(
		`file - '${doc_path}' embedding completed.`,
		process.env.MODEL_DISPLAY_NAME,
		"embedding"
	)

	await store_conversation_user_file(
		conv_name,
		parsed_conversation_history_user
	);
}

