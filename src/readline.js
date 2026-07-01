import * as readline from "readline";

export const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

export function read_user_input(question) {
	return new Promise((resolve, reject) => {
		rl.question(question, (answer) => {
			resolve(answer);
		});
	});
}
