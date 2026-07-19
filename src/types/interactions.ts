import { type Entity } from "../types/output.js";

export interface InteractionContent {
	text: string;
	role: Entity;
	responseId?: string;
}

export interface InteractionRecord {
	outputs: InteractionContent[];
	modelVersion: string;
}
