export async function print_help_command() {
	process.stdout.write("\x1B[38;2;255;180;180m");
	console.log("MODEL:");
	process.stdout.write("\x1B[0m");	
	
	process.stdout.write("\x1B[38;2;160;160;220m");
	console.log("\t/models\t\t\t\tList models");
	console.log("\t/model <name>\t\t\tSet model");
	console.log("\t/model_info [name]\t\tModel details");
	process.stdout.write("\x1B[0m");	

	console.log("\n");
	
	process.stdout.write("\x1B[38;2;255;180;180m");
	console.log("Chat:");
	process.stdout.write("\x1B[0m");	

	process.stdout.write("\x1B[38;2;160;160;220m");
	console.log("\t/chat <msg>\t\t\tOne-shot request");
	console.log("\t/guest_chat\t\t\tAnonymous chat");
	process.stdout.write("\x1B[0m");	

	console.log("\n");

	process.stdout.write("\x1B[38;2;255;180;180m");
	console.log("Conversation:");
	process.stdout.write("\x1B[0m");	

	process.stdout.write("\x1B[38;2;160;160;220m");
	console.log("\t/new [name]\t\t\tNew conversation");
	console.log("\t/switch <id>\t\t\tSwitch conversation");
	console.log("\t/history\t\t\tShow history");
	process.stdout.write("\x1B[0m");	

	console.log("\n");

	process.stdout.write("\x1B[38;2;255;180;180m");
	console.log("Storage:");
	process.stdout.write("\x1B[0m");	
	
	process.stdout.write("\x1B[38;2;160;160;220m");
	console.log("\t/load\t\t\t\tLoad chat");
	console.log("\t/delete <id>\t\t\tDelete chat");
	console.log("\t/list\t\t\t\tList chat");
	console.log("\t/embed <doc_path>\t\tUpload document");
	process.stdout.write("\x1B[0m");	

	console.log("\n");

	process.stdout.write("\x1B[38;2;255;180;180m");
	console.log("System:");
	process.stdout.write("\x1B[0m");	

	process.stdout.write("\x1B[38;2;160;160;220m");
	console.log("\t/system_instruction <message>\tUpdates the chatbot's system prompt");
	console.log("\t/token_limit <token_limit>\tThe Maximum conversation context size in tokens");
	console.log("\t/status\t\t\t\tCurrent status");
	console.log("\t/conversation_mode <type>\trest | interactions");
	console.log("\t/clear\t\t\t\tClear screen");
	console.log("\t/help\t\t\t\tShow help");
	console.log("\t/exit\t\t\t\tQuit");
	process.stdout.write("\x1B[0m");	
}
