import axios from "axios";
import { GoogleGenAI, Pager, Chat } from "@google/genai";
import { aiModel, embeddingModel, systemInstructionMessage } from "../config/ai.js";
import { GEMINI_API_KEY } from "../config/env.js";
import {} from "../types/ai.js";
export const ai = initializeAi();
export function initializeAi() {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    return ai;
}
export async function aiModelList(initializedAi) {
    const response = await initializedAi.models.list();
    const parsedAiModelList = [];
    for await (const model of response) {
        if (model.description && model.name) {
            parsedAiModelList.push({
                name: model.name,
                description: model.description
            });
        }
    }
    return parsedAiModelList;
}
;
export async function initiateChat(initializedAi, model = aiModel) {
    const chat = initializedAi.chats.create({
        model
    });
    return chat;
}
export async function sendChatMessage(chat, message) {
    const response = await chat.sendMessage({
        message
    });
    return response;
}
export async function getAiModelDetails(initializedAi, model) {
    const response = await initializedAi.models.get({ model });
    if (!response) {
        throw new Error(`invalid model name - ${model}`);
    }
    const modelInfo = {
        name: response.name,
        description: response.description,
        displayName: response.displayName,
        temperature: response.temperature,
        maxTemperature: response.maxTemperature,
        inputTokenLimit: response.inputTokenLimit,
        outputTokenLimit: response.outputTokenLimit,
        thinking: response?.thinking,
        topK: response.topK,
        topP: response.topP
    };
    return modelInfo;
}
export async function countTokens(contents, model = aiModel) {
    try {
        const query = await axios({
            method: "POST",
            url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:countTokens`,
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": GEMINI_API_KEY
            },
            data: {
                contents: contents
            },
            responseType: "json"
        });
        const response = query.data;
        return response;
    }
    catch (err) {
        console.log("err -", err);
    }
}
export async function embedContent(content, model = embeddingModel) {
    try {
        const query = await axios({
            method: "POST",
            url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`,
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": GEMINI_API_KEY
            },
            data: { content }
        });
        const response = query.data;
        return response;
    }
    catch (err) {
        console.log("err -", err);
    }
}
export async function generateContent(content, model = aiModel) {
    let response = "";
    let modelVersion;
    let systemInstruction = { parts: [{ text: systemInstructionMessage }] };
    try {
        const query = await axios({
            method: "POST",
            url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": GEMINI_API_KEY
            },
            data: {
                systemInstruction,
                contents: content
            },
            responseType: "json"
        });
        modelVersion = query.data.modelVersion;
        const parts = query.data.candidates[0].content.parts;
        for (let i = 0; i < parts.length; i++) {
            if (parts[i].text)
                response += parts[i].text;
        }
    }
    catch (err) {
        console.log("model response err -", err);
    }
    return [response, modelVersion];
}
export async function createNewInteraction(content, prevInteractionId = "", model = aiModel) {
    let reqBody = {};
    reqBody.input = content;
    reqBody.model = model;
    reqBody.systemInstruction = systemInstructionMessage;
    if (prevInteractionId) {
        reqBody.prevInteractionId = prevInteractionId;
    }
    let modelResponse = "";
    let modelVersion;
    let modelResponseId;
    try {
        const query = await axios({
            method: "POST",
            url: "https://generativelanguage.googleapis.com/v1beta/interactions",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": GEMINI_API_KEY
            },
            data: reqBody
        });
        const outputs = query.data.outputs;
        for (const el of outputs) {
            if (el.type === "text") {
                modelResponse += el.text;
            }
        }
        modelResponseId = query.data.id;
        modelVersion = query.data.model;
    }
    catch (err) {
        console.log("err -", err);
    }
    return [modelResponse, modelResponseId, modelVersion];
}
//# sourceMappingURL=gemini_model.js.map