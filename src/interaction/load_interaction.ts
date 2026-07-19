import fs from "fs";
import path from "path";
import { interactionsDir } from "../config/path.js";
import type { InteractionRecord } from "../types/interactions.js";

export function loadInteraction(convName: string): InteractionRecord{

	const interactionHistory = fs.readFileSync(
		path.join(interactionsDir, convName)
	);

	let parsedInteractionHistory: InteractionRecord = JSON.parse(
		interactionHistory.toString()
	);

	return parsedInteractionHistory;
}
