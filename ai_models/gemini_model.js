import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import {
	ai_model,
	embedding_model,
	system_instruction_message,
	conversation_token_limit
} from "../config/ai.js";

export const ai = initialize_ai();

export function initialize_ai(
) {
	const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
	return ai;
}

export async function ai_model_list(initialized_ai) {
	const response = await initialized_ai.models.list();

	const ai_model_list = response.pageInternal;
	const parsed_ai_model_list = ai_model_list.filter(el => el.description).map(el => {
		return {
			name: el.name,
			description: el.description,
		}
	});

	return parsed_ai_model_list;
};

export async function initiate_chat(
	initialized_ai,
	model = ai_model
) {
	const chat = initialized_ai.chats.create({
		model
	});

	return chat;
}

export async function send_chat_message(chat, message) {
	const response = await chat.sendMessage({
		message
	});

	return response;
}

export async function get_ai_model_details(initialized_ai, model) {
	const response = await initialized_ai.models.get({ model });

	return response;
}

export async function count_tokens(contents, model = ai_model) {
	try {
		const query = await axios({
			method: "POST",
			url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:countTokens`,
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": `${process.env.GEMINI_API_KEY}`
			},
			data: {
				contents: contents
			},
			responseType: "json"
		});

		const response = query.data;
		return response;
	} catch (err) {
		console.log("err -", err);
	}
}

export async function embed_content(content, model = embedding_model) {
	try {
		const query = await axios({
			method: "POST",
			url: `https://generativelanguage.googleapis.com/v1beta/models/${embedding_model}:embedContent`,
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": `${process.env.GEMINI_API_KEY}`
			},
			data: { content }
		})

		const response = query.data;
		return response;
	} catch (err) {
		console.log("err -", err);
	}
}

export async function generate_content(
	contents,
	model = ai_model,
) {
	let response = "";
	let model_version;

	let system_instruction = { parts: [{ text: system_instruction_message }] };
	try {
		const query = await axios({
			method: "POST",
			url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": `${process.env.GEMINI_API_KEY}`
			},
			data: {
				system_instruction,
				contents: contents
			},
			responseType: "json"
		});

		model_version = query.data.modelVersion;
		const parts = query.data.candidates[0].content.parts;
		for (let i = 0; i < parts.length; i++) {
			if (parts[i].text)
				response += parts[i].text;
		}
	} catch (err) {
		console.log("model response err -", err);
	}

	return [response, model_version];
}

export async function create_new_interaction(
	content,
	prev_interaction_id = "",
	model = ai_model,
) {
	let req_body = {};
	req_body.input = content;
	req_body.model = model;
	req_body.system_instruction = system_instruction_message;

	if (prev_interaction_id) {
		req_body.previous_interaction_id = prev_interaction_id;
	}

	let model_response = "";
	let model_version;
	let model_response_id;
	try {
		const query = await axios({
			method: "POST",
			url: "https://generativelanguage.googleapis.com/v1beta/interactions",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": `${process.env.GEMINI_API_KEY}`
			},
			data: req_body
		})

		const outputs = query.data.outputs;
		for (const el of outputs) {
			if (el.type === "text") {
				model_response += el.text;
			}
		}

		model_response_id = query.data.id;
		model_version = query.data.model;
	} catch (err) {
		console.log("err -", err);
	}

	return [model_response, model_version, model_response_id];
}

