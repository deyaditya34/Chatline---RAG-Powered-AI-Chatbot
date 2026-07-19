export function parseCommand(input: string): [string, string[]] {
	let [command, ...args] = input.split(" ");

	command = command!.slice(1, command!.length);
	return [command, args];
}

