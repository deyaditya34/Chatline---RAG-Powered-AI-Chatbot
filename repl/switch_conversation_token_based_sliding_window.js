import fs from "fs";
import { handle_command } from "../command.js";
import { read_user_input } from "../readline.js";
import {
	parse_command, tail_conversation,
	sanitize_conversation, sanitize_and_print_conversation, print_output
} from "../utils.js";
import { insert_document, search_documents } from "../databases/qdrant.js";
import * as elastic_search from "../databases/elastic_search.js";
import user_prompts from "../prompts/default_user_prompts.json" with {type: "json"};
import ai_prompts from "../prompts/default_ai_prompts.json" with {type: "json"};
import {
	generate_content_using_http, sliding_window_size, conversation_token_limit,
	count_tokens, embed_content
} from "../ai_model.js";

export async function switch_sliding_window_token_based_conversation(conv_name) {
	let user_response;
	let model_response;
	let sanitize_model_response;
	let user_prompt_embedding;
	let model_response_embedding;
	let token_limit_exceeded_once;

	const chat_save_dir_for_user =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_STORAGE_DIR}`;

	const chat_save_dir_for_model =
		`${process.env.CONV_STORAGE_DIR}/${process.env.STATELESS_CONV_TOKEN_BASED_SLIDING_DIR}`;

	const fileName = conv_name;
	let conversation_history_user = fs.readFileSync(
		`${chat_save_dir_for_user}/${fileName}`
	);
	let parsed_conversation_history_user = JSON.parse(conversation_history_user.toString());
	sanitize_and_print_conversation(parsed_conversation_history_user);

	while (true) {
		user_response = await read_user_input(
			process.env.USER_CONV_DISPLAY_NAME
		);

		if (user_response.startsWith("/")) {
			let sanitize_model_response;
			const [command, args] = parse_command(user_response);

			await handle_command(command, args);
			break;
		}

		const sanitize_user_response = sanitize_conversation(user_response, "user");

		conversation_history_user = fs.readFileSync(`${chat_save_dir_for_user}/${fileName}`);
		parsed_conversation_history_user = JSON.parse(conversation_history_user.toString());
		const conversation_history_model = fs.readFileSync(`${chat_save_dir_for_model}/${fileName}`);
		let parsed_conversation_history_model = JSON.parse(conversation_history_model.toString());

		const user_prompt_embedding_result = await embed_content(
			sanitize_conversation(user_response, "user")
		);
		user_prompt_embedding = user_prompt_embedding_result.embedding.values;

		if (parsed_conversation_history_user.uploadedDocuments.length > 0) {
			const semantic_result = await search_documents(user_prompt_embedding, fileName, "document");

			if (semantic_result.length > 0) {
				let semantic_context = "You may use the following retrieved context: \n\n";
				for (const point of semantic_result) {
					semantic_context += point.payload.text + "\n\n";
				}
				const sanitize_semantic_context = sanitize_conversation(semantic_context, "user");
				parsed_conversation_history_model.contents.push(sanitize_semantic_context);
			}

			const elastic_search_result = await elastic_search.
				search_in_uploaded_docs(user_response, fileName);

			if (elastic_search_result.length > 0) {
				let elastic_context = "You may use the following retrieved context: \n\n";
				for (const result of elastic_search_result) {
					elastic_context += result._source.text + "\n\n";
				}
				const sanitize_elastic_context = sanitize_conversation(elastic_context, "user");
				parsed_conversation_history_model.contents.push(sanitize_elastic_context);
			}
		}

		if (parsed_conversation_history_user.token_limit_exceeded_once) {
			const semantic_result = await search_documents(user_prompt_embedding, fileName, "conversation");

			if (semantic_result.length > 0) {
				for (const point of semantic_result) {
					const sanitize_semantic_context = sanitize_conversation(point.payload.text, point.payload.role);
					parsed_conversation_history_model.contents.push(sanitize_semantic_context);
				}
			}

			const elastic_search_result = await elastic_search.search_in_past_conversation(
				user_response,
				chat_topic
			);

			if (elastic_search_result.length > 0) {
				for (const result of elastic_search_result) {
					const sanitize_elastic_context = sanitize_conversation(result._source.text, result._source.role);
					parsed_conversation_history_model.contents.push(sanitize_elastic_context);
				}
			}
		}

		parsed_conversation_history_user.contents.push(sanitize_user_response);
		parsed_conversation_history_model.contents.push(sanitize_user_response);

		let token_consumed = await count_tokens(parsed_conversation_history_model.contents);

		if (token_consumed.totalTokens >= conversation_token_limit) {
			parsed_conversation_history_user.token_limit_exceeded_once = true;

			parsed_conversation_history_model.contents.pop();
			const sanitize_ai_summarize_prompt = sanitize_conversation(ai_prompts.summarize_user_conv_prompt, "user");
			parsed_conversation_history_model.contents.push(sanitize_ai_summarize_prompt);

			while (true) {
				let [model_response, model_version] = await generate_content_using_http(
					parsed_conversation_history_model.contents
				);

				sanitize_model_response = sanitize_conversation(model_response, "model");
				parsed_conversation_history_model.contents = [];
				parsed_conversation_history_model.contents.push(sanitize_model_response);

				const semantic_result = await search_documents(user_prompt_embedding, fileName, "conversation");
				if (semantic_result.length > 0) {
					for (const point of semantic_result) {
						const sanitize_semantic_context = sanitize_conversation(point.payload.text, point.payload.role);
						parsed_conversation_history_model.contents.push(sanitize_semantic_context);
					}
				}

				const elastic_search_result = await elastic_search.search_in_past_conversation(
					user_response,
					fileName
				);

				if (elastic_search_result.length > 0) {
					for (const result of elastic_search_result) {
						const sanitize_elastic_context = sanitize_conversation(result._source.text, result._source.role);
						parsed_conversation_history_model.contents.push(sanitize_elastic_context);
					}
				}

				parsed_conversation_history_model.contents.push(sanitize_ai_summarize_prompt);

				token_consumed = await count_tokens(parsed_conversation_history_model.contents);

				if (token_consumed.totalTokens <= conversation_token_limit) {
					parsed_conversation_history_model.contents.pop();
					parsed_conversation_history_model.contents.push(sanitize_user_response);
					break;
				}
			}
		}

		let prev_model_version = parsed_conversation_history_user.model_version;
		let [model_response, model_version] = await generate_content_using_http(
			parsed_conversation_history_model.contents,
			prev_model_version
		);

		sanitize_model_response = sanitize_conversation(model_response, "model");

		let model_response_embedding_result = await embed_content(sanitize_model_response);
		model_response_embedding = model_response_embedding_result.embedding.values;

		let user_prompt_chunk_payload = {
			text: user_response,
			conversation_id: fileName,
			source_type: "conversation",
			role: "user",
			uploaded_at: Date.now(),
		}

		let model_response_chunk_payload = {
			text: model_response,
			conversation_id: fileName,
			source_type: "conversation",
			role: "model",
			uploaded_at: Date.now()
		}

		try {
			await insert_document(
				{
					embedding: user_prompt_embedding,
					payload: user_prompt_chunk_payload
				}
			);

			await insert_document(
				{
					embedding: model_response_embedding,
					payload: model_response_chunk_payload
				}
			);
		} catch (err) {
			console.error("err in storing the conversations as vectors -", err);
			return;
		}

		try {
			await elastic_search.insert_document(
				{
					text: user_response,
					conversation_id: fileName,
					source_type: "conversation",
					role: "user",
					uploaded_at: Date.now()
				}
			);

			await elastic_search.insert_document(
				{
					text: model_response,
					conversation_id: fileName,
					source_type: "conversation",
					role: "model",
					uploaded_at: Date.now()
				}
			);
		} catch (err) {
			console.error("err in storing the conversations as elastic search -", err);
		}

		print_output(model_response, process.env.MODEL_DISPLAY_NAME, "conversations");

		parsed_conversation_history_user.contents.push(sanitize_model_response);
		parsed_conversation_history_user.model_version = model_version;

		parsed_conversation_history_model.contents.push(sanitize_model_response);

		fs.writeFileSync(
			`${chat_save_dir_for_user}/${fileName}`,
			JSON.stringify(parsed_conversation_history_user)
		);

		fs.writeFileSync(`${chat_save_dir_for_model}/${fileName}`,
			JSON.stringify(parsed_conversation_history_model)
		);
	}
}
