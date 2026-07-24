import fs from "fs";
import path from "path";
import { createInteractionRecord } from "./utils.js";
import { interactionsDir } from "../config/path.js";
import { wrapError } from "../errors/wrapError.js";
import { FileError } from "../errors/file_error.js";

export function initializeInteraction(convName: string): void {
	try {
		const inititalInteractionBoilerplate = createInteractionRecord();

		fs.writeFileSync(
			path.join(interactionsDir, convName),
			JSON.stringify(inititalInteractionBoilerplate)
		);
	} catch (err) {
		wrapError(err, FileError, "failed to write interaction record")
	}
}
