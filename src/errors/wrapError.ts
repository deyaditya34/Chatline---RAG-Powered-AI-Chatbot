export function wrapError(
	err: unknown,
	ErrorClass: new (
		message: string,
		options?: ErrorOptions
	) => Error,
	message: string
): never {
	if (err instanceof Error) {
		throw new ErrorClass(message, {
			cause: err
		})
	}

	throw new ErrorClass(message);
}
