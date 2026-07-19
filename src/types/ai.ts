export interface ModelList {
	name: string,
	description: string
}

export interface ModelInfo {
	name?: string | undefined,
	displayName?: string | undefined,
	description?: string | undefined,
	inputTokenLimit?: number | undefined,
	outputTokenLimit?: number | undefined,
	temperature?: number | undefined,
	maxTemperature?: number | undefined,
	topP?: number | undefined,
	topK?: number | undefined,
	thinking?: boolean | undefined
}
