import { aiModel, systemInstructionMessage } from "../config/ai.js";
import { mode, currentConversationId } from "../session.js";

export function printCurrentStatus(): void {
	process.stdout.write("\x1B[38;2;255;180;180m");
	console.log("\x1B[38;2;255;180;180mMODEL:");
	process.stdout.write("\x1B[0m");

	process.stdout.write("\x1B[38;2;160;160;220m");
	if (currentConversationId) {
		console.log(`\tCurrent Conversation\t\t${currentConversationId}`);
	} else {
		console.log(`\tCurrent Conversation\t\tNot Selected`);
	}
	console.log(`\tModel\t\t\t\t${aiModel}`);
	console.log(`\tMode\t\t\t\t${mode}`);
	console.log(`\tSystem Instruction\t\t${systemInstructionMessage}`);
	process.stdout.write("\x1B[0m");
}
