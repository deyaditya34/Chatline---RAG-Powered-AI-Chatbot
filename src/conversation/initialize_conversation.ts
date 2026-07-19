import fs from "fs";
import path from "path";
import { userConversationsDir, modelConversationsDir } from "../config/path.js";
import { createConversationRecord } from "./utils.js";

export function initializeConversation(convName: string): void {

	const inititalConversationBoilerplate = createConversationRecord();
	fs.writeFileSync(
		path.join(userConversationsDir, convName),
		JSON.stringify(inititalConversationBoilerplate)
	);	

	fs.writeFileSync(
		path.join(modelConversationsDir, convName),
		JSON.stringify(inititalConversationBoilerplate)
	); 
}
