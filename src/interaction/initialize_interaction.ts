import fs from "fs";
import path from "path";
import { createInteractionRecord } from "./utils.js";
import { interactionsDir } from "../config/path.js";

export function initializeInteraction(convName: string): void {

	const inititalInteractionBoilerplate = createInteractionRecord();

	fs.writeFileSync(
		path.join(interactionsDir, convName),
		JSON.stringify(inititalInteractionBoilerplate)
	);
}
