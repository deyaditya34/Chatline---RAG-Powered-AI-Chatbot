import fs from "fs";
import path from "path";
import { interactionsDir } from "../config/path.js";
import type { InteractionRecord } from "../types/interactions.js";
import { wrapError } from "../errors/wrapError.js";
import { FileError } from "../errors/file_error.js";

export function loadInteraction(convName: string): InteractionRecord {

	try {
		const interactionHistory = fs.readFileSync(
			path.join(interactionsDir, convName)
		);

		let parsedInteractionHistory: InteractionRecord = JSON.parse(
			interactionHistory.toString()
		);

		return parsedInteractionHistory;
	} catch (err) {
		wrapError(err, FileError, "failed to read interaction record")
	}
}
