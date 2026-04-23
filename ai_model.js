import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const ai = initialize_ai();
export let ai_model = process.env.DEFAULT_MODEL;
export let system_instruction = process.env.DEFAULT_SYSTEM_INSTRUCTION;


export function initialize_ai(
) {
	const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
	return ai;
}

export function set_ai_model(model_name) {
	ai_model = model_name;
}

export async function generate_content(
	initialized_ai,
	contents,
	model = ai_model,
	systemInstruction = system_instruction
) {
	const response = await initialized_ai.models.generateContent({
		model,
		contents,
		config: {
			systemInstruction,
			temperature: 2,
			thinkingConfig: {
				thinkingBudget: -1
			}
		}
	});

	return response.text;
};

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

export async function generate_content_using_http(
	contents,
	model = ai_model
) {
	let response = "";
	let model_version;
	try {
		const query = await axios({
			method: "POST",
			url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": `${process.env.GEMINI_API_KEY}`
			},
			data: {
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
		console.log("err -", err);
	}

	return [response, model_version];
}

export async function create_new_interaction(
	content,
	prev_interaction_id = "",
	model = ai_model
) {
	let req_body = {};
	req_body.input = content;
	req_body.model = model;

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
		console.log("err -", err.message, err.code);
	}

	return [model_response, model_version, model_response_id];
}

