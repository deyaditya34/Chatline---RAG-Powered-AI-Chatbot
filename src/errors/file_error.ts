import { ApplicationError } from "./application_error.js";

export class FileError extends ApplicationError {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
	}
}
