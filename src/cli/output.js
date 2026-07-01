export function print_list(list) {
	process.stdout.write(`\x1B[38;2;255;180;180m`);
	for (let i = 0; i < list.length; i++) {
		console.log(`${i + 1} ${list[i]}`);
	}
	process.stdout.write(`\x1B[0m`);
}

export function print_message(message) {
	process.stdout.write(`\x1B[38;2;255;180;180m[Model]: ${message}`);
	process.stdout.write(`\x1B[0m\n`);
}

export function print_output(message, entity, job) {
	if (job === "conversation" || job === "interaction") {
		const [first_line, ...rest] = message.split("\n");

		if (entity === process.env.MODEL_DISPLAY_NAME) {
			console.log(`\x1B[38;2;255;180;180m[${entity}]: ${first_line}`);
		} else {
			console.log(`\x1B[38;2;160;160;220m${entity} ${first_line}`);
		}
		for (const line of rest) {
			if (entity === process.env.MODEL_DISPLAY_NAME) {
				console.log(" ".repeat(`[${entity}]: `.length) + line);
			} else {
				console.log(" ".repeat(entity.length) + line);
			}
		}
		process.stdout.write("\x1B[0m");
	}
	else if (job === "model_info") {
		let result = {};
		for (const [key, value] of Object.entries(message)) {
			switch (typeof (value)) {
				case "object":
					if (Array.isArray(value)) {
						result[key] = value.join(", ");
					} else {
						result[key] = "";
					}
					break;
				default:
					result[key] = value;
			}
		}
		console.log(`\x1B[38;2;255;180;180m[${entity}]: \x1B[0m`);
		console.table(result);
	}
	else if (job === "model_list") {
		let result = {};
		for (let i = 0; i < message.length; i++) {
			let key = message[i].name;
			let value = message[i].description;

			result[key] = value;
		}

		console.log(`\x1B[38;2;255;180;180m[${entity}]: \x1B[0m`);
		console.table(result);
	}
	else if (job === "embedding") {
		console.log(`\x1B[38;2;255;180;180m[${entity}]: ${message}\x1B[0m`);
	}
}
