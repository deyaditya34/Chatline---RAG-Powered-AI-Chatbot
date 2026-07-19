import { handleCommand } from "../command.js";
import { readUserInput } from "../readline.js";
import { createConversationRecord, sanitizeConversation } from "../conversation/utils.js";
import { printConversation, printMessage } from "../cli/output.js";
import { parseCommand } from "./utils.js";
import { generateContent } from "../ai_models/gemini_model.js";
import userPrompts from "../prompts/default_user_prompts.json" with {type: "json"};
import { USER_CONV_DISPLAY_NAME } from "../config/env.js";

export async function newConversationGuest(): Promise<void> {
	let userResponse;

	const initital_conversation_boilerplate = createConversationRecord();

	printMessage(userPrompts.chatUserPrompt);
	while (true) {
		userResponse = await readUserInput(USER_CONV_DISPLAY_NAME);

		if (userResponse.startsWith("/")) {
			const [command, args] = parseCommand(userResponse);

			await handleCommand(command, args);
			break;
		}

		const sanitizedUserResponse = sanitizeConversation(userResponse, "user");

		initital_conversation_boilerplate.contents.push(sanitizedUserResponse);

		let [modelResponse] = await generateContent(
			initital_conversation_boilerplate.contents,
		);

		printConversation(modelResponse, "model", "conversation");

		const sanitizedModelResponse = sanitizeConversation(modelResponse, "model");
		initital_conversation_boilerplate.contents.push(sanitizedModelResponse);
	}
}
