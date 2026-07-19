import { GoogleGenAI, Chat, type Content } from "@google/genai";
import { type ModelList, type ModelInfo } from "../types/ai.js";
export declare const ai: GoogleGenAI;
export declare function initializeAi(): GoogleGenAI;
export declare function aiModelList(initializedAi: GoogleGenAI): Promise<ModelList[]>;
export declare function initiateChat(initializedAi: GoogleGenAI, model?: string): Promise<Chat>;
export declare function sendChatMessage(chat: Chat, message: string): Promise<import("@google/genai").GenerateContentResponse>;
export declare function getAiModelDetails(initializedAi: GoogleGenAI, model: string): Promise<ModelInfo>;
export declare function countTokens(contents: Content[], model?: string): Promise<any>;
export declare function embedContent(content: Content, model?: string): Promise<any>;
export declare function generateContent(content: Content[], model?: string): Promise<any[]>;
export declare function createNewInteraction(content: string, prevInteractionId?: string, model?: string): Promise<any[]>;
//# sourceMappingURL=gemini_model.d.ts.map