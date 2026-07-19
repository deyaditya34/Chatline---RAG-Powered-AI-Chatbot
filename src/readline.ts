import * as readline from "readline";

export const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

export function readUserInput(question: string): Promise<string> {
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			resolve(answer);
		});
	});
}
