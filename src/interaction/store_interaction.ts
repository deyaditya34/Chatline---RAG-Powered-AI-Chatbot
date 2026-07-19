import fs from "fs";
import path from "path";
import { interactionsDir } from "../config/path.js";
import type { InteractionRecord } from "../types/interactions.js";

export function storeInteraction(convName: string, interactionHistory: InteractionRecord): void {

	fs.writeFileSync(
		path.join(interactionsDir, convName),
		JSON.stringify(interactionHistory)
	);
}
