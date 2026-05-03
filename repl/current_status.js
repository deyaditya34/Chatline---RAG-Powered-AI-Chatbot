import {ai_model, system_instruction_message} from "../ai_model.js";
import {mode} from "../command.js";

export function print_current_status() {
	process.stdout.write("\x1B[38;2;255;180;180m");
	console.log("\x1B[38;2;255;180;180mMODEL:");
	process.stdout.write("\x1B[0m");

	process.stdout.write("\x1B[38;2;160;160;220m");
	console.log(`\tModel\t\t\t\t${ai_model}`);
	console.log(`\tMode\t\t\t\t${mode}`);
	console.log(`\tSystem Instruction\t\t${system_instruction_message}`);
	process.stdout.write("\x1B[0m");	
}
